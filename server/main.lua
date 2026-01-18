local cooldowns = {}

local function nowSeconds()
  return os.time()
end

local function getCooldownRemaining(source, deptId)
  local perPlayer = cooldowns[source]
  if not perPlayer then return 0 end

  local untilTs = perPlayer[deptId]
  if not untilTs then return 0 end

  local remain = untilTs - nowSeconds()
  if remain < 0 then return 0 end
  return remain
end

local function setCooldown(source, deptId, seconds)
  cooldowns[source] = cooldowns[source] or {}
  cooldowns[source][deptId] = nowSeconds() + seconds
end

AddEventHandler("playerDropped", function()
  local src = source
  cooldowns[src] = nil
end)

local function findDepartment(deptId)
  for _, d in ipairs(Config.Departments) do
    if d.id == deptId then return d end
  end
  return nil
end

local function clampPriority(p)
  if p == "low" or p == "medium" or p == "high" then
    return p
  end
  return Config.Dispatch.DefaultPriority
end

-- Qbox: Character Name aus PlayerData.charinfo holen (Firstname Lastname)
local function getCharacterName(source, L)
  local ok, qb = pcall(function()
    return exports.qbx_core:GetPlayer(source)
  end)

  if ok and qb and qb.PlayerData then
    local ci = qb.PlayerData.charinfo
    if ci and ci.firstname and ci.lastname and ci.firstname ~= "" and ci.lastname ~= "" then
      return ("%s %s"):format(ci.firstname, ci.lastname)
    end

    -- Fallback: falls vorhanden
    if qb.PlayerData.name and qb.PlayerData.name ~= "" then
      return tostring(qb.PlayerData.name)
    end
  end

  return L.dispatch_sender_unknown or ("ID " .. tostring(source))
end

-- Optional: Priorität hübsch aus Locale
local function prettyPriority(priority, L)
  if priority == "low" then return L.priority_low or "low" end
  if priority == "medium" then return L.priority_medium or "medium" end
  if priority == "high" then return L.priority_high or "high" end
  return tostring(priority)
end

lib.callback.register("dispatch_phone:server:addDispatch", function(source, data)
  local L = GetLocale(Config.Language or "de")

  if type(data) ~= "table" then
    return { success = false, message = L.err_failed }
  end

  local dept = findDepartment(data.department)
  if not dept then
    return { success = false, message = L.err_unknown_department }
  end

  -- Cooldown check (per department, per player)
  local cd = tonumber(Config.Dispatch.CooldownSeconds) or 0
  if cd > 0 then
    local remaining = getCooldownRemaining(source, dept.id)
    if remaining > 0 then
      local mins = math.ceil(remaining / 60)
      return {
        success = false,
        message = LocaleFormat(L.cooldown_active or "Bitte warten: Du kannst an {dept} erst in {mins} Minute(n) wieder senden.", {
          dept = dept.label,
          mins = mins
        })
      }
    end
  end

  local msg = tostring(data.message or ""):gsub("^%s+", ""):gsub("%s+$", "")
  if #msg < 3 then
    return { success = false, message = L.err_text_too_short }
  end
  if #msg > 500 then
    msg = msg:sub(1, 500)
  end

  local priority = clampPriority(data.priority)
  local location = data.location or { label = (L.location_unknown or "Unbekannt"), coords = { x = 0.0, y = 0.0 } }

  local job = dept.tabletJob -- 'police' | 'ambulance'
  local sound = Config.Dispatch.Sounds[job]

  local blip = nil
  if Config.Dispatch.Blip.Enabled then
    blip = Config.Dispatch.Blip[job]
  end

  local anonymous = (data.anonymous == true)
  local senderName = anonymous and (L.dispatch_sender_unknown or "Unbekannt") or getCharacterName(source, L)
  local priorityLabel = prettyPriority(priority, L)

  local dispatch = {
    priority = priority,
    code = "PHONE",
    title = LocaleFormat(L.dispatch_title, { dept = dept.label }),
    description = msg,
    location = {
      label = location.label or (L.location_unknown or "Unbekannt"),
      coords = location.coords, -- {x,y}
    },
    time = Config.Dispatch.DurationSeconds,
    job = job,
    sound = sound,
    fields = {
      { icon = "fa-solid fa-building-shield",      label = L.dispatch_field_department, value = dept.label },
      { icon = "fa-solid fa-triangle-exclamation", label = L.dispatch_field_priority,   value = priorityLabel },
      { icon = "fa-solid fa-user",                 label = L.dispatch_field_sender,     value = senderName },
    },
    blip = blip
  }

  local ok, dispatchId = pcall(function()
    return exports["lb-tablet"]:AddDispatch(dispatch)
  end)

  if not ok then
    return { success = false, message = L.err_failed }
  end

  -- Set cooldown only after successful dispatch
  if cd > 0 then
    setCooldown(source, dept.id, cd)
  end

  return { success = true, dispatchId = dispatchId }
end)