local RESOURCE = GetCurrentResourceName()
local LANG = Config.Language or "de"

-- Helper um NUI-URLs konsistent zu bauen (wie in vielen 17mov/Phone-Setups)
local function nuiUrl(path)
  return ("https://cfx-nui-%s/%s"):format(RESOURCE, path)
end

local function getDeptLabel(deptId)
  for _, d in ipairs(Config.Departments) do
    if d.id == deptId then
      return d.label
    end
  end
  return deptId or "Dispatch"
end

local function getPlayerLocation()
  local ped = PlayerPedId()
  local coords = GetEntityCoords(ped)

  local streetHash = GetStreetNameAtCoord(coords.x, coords.y, coords.z)
  local streetName = GetStreetNameFromHashKey(streetHash)

  local label = (streetName and streetName ~= "") and streetName
    or ("X: %.1f Y: %.1f"):format(coords.x, coords.y)

  return {
    label = label,
    coords = { x = coords.x, y = coords.y }
  }
end

CreateThread(function()
  Wait(1000)
  exports['17mov_Phone']:AddApplication({
    name = Config.App.Name,
    label = Config.App.Label,
    ui = nuiUrl("web/build/index.html"),
    icon = nuiUrl("web/build/icon.svg"),
    iconBackground = Config.App.IconBackground,
    default = Config.App.Default,
    preInstalled = Config.App.PreInstalled,
    resourceName = RESOURCE,
    rating = 5.0,
  })
end)

-- Konfliktfrei: UI nutzt Dispatch:GetLanguage (damit locales/local.lua immer greift)
RegisterNUICallback("Dispatch:GetLanguage", function(_, cb)
  local lang = Config.Language or "de"
  local L = GetLocale(lang)

  -- neue Table bauen -> immer frisches JSON
  local strings = {}
  for k, v in pairs(L) do
    strings[k] = v
  end

  cb({
    language = lang,
    strings = strings,
  })
end)

-- Optional: Falls irgendwas im Phone/Boilerplate weiterhin Core:GetLanguage aufruft, liefern wir es auch
RegisterNUICallback("Core:GetLanguage", function(_, cb)
  local lang = Config.Language or "de"
  local L = GetLocale(lang)

  local strings = {}
  for k, v in pairs(L) do
    strings[k] = v
  end

  cb({
    language = lang,
    strings = strings,
  })
end)

-- UI liest Departments + Defaults dynamisch aus Config
RegisterNUICallback("Dispatch:GetConfig", function(_, cb)
  cb({
    departments = Config.Departments,
    defaultPriority = Config.Dispatch.DefaultPriority,
  })
end)

-- UI -> Dispatch senden (Server) -> native 17mov Notify
RegisterNUICallback("Core:SendDispatch", function(data, cb)
  local lang = Config.Language or "de"
  local L = GetLocale(lang)

  local payload = {
    department = data.department,
    message = data.message,
    priority = data.priority,
    anonymous = (data.anonymous == true),
    location = getPlayerLocation(),
  }

  local res = lib.callback.await("dispatch_phone:server:addDispatch", false, payload)

  -- UI bekommt immer Response (damit busy state sauber endet)
  cb(res)

  -- 17mov-Phone Notification
  local number = nil
  local ok, playerNumber = pcall(function()
    return exports["17mov_Phone"]:GetPlayerNumber()
  end)
  if ok then number = playerNumber end

  if res and res.success then
    local deptLabel = getDeptLabel(data.department)

    exports["17mov_Phone"]:CreateNotification({
      app = Config.App.Name,
      title = L.notify_sent_title,
      message = LocaleFormat(L.notify_sent_message, { dept = deptLabel }),
      number = number,
      data = { alwaysShow = true }
    })
  else
    local reason = (res and res.message) and tostring(res.message) or L.err_failed

    exports["17mov_Phone"]:CreateNotification({
      app = Config.App.Name,
      title = L.notify_failed_title,
      message = LocaleFormat(L.notify_failed_message, { reason = reason }),
      number = number,
      data = { alwaysShow = true }
    })
  end
end)