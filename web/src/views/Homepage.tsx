import { useCallback } from 'react';
import { CardSim, ChevronRight, Hammer, SunMoon } from 'lucide-react';

import { useNavigateWithApps } from '@/hooks/useNavigateWithApps';
import { useLanguage } from '@/hooks/useLanguage';

interface ComponentAction {
    label: string;
    onClick: () => void;
}

interface ComponentList {
    label: string;
    actions: ComponentAction[];
}

const Homepage = () => {
    const { getLang } = useLanguage();
    const navigate = useNavigateWithApps();
    const settings = useSettings();

    // Callbacks
    const cameraCallback = useCallback((data: string) => {
        console.log('Camera captured data:', data);
    }, []);

    const contactPickerCallback = useCallback((number: string) => {
        console.log('Contact selected number:', number);
    }, []);

    const galleryCallback = useCallback((data: string | string[]) => {
        console.log('Gallery selected data:', data);
    }, []);

    const emojiCallback = useCallback((data: string) => {
        console.log('Emoji selected data:', data);
    }, []);

    const gifCallback = useCallback((data: string) => {
        console.log('GIF selected data:', data);
    }, []);

    // Handlers
    const handleNavigateToPage = () => {
        navigate('/page');
    };

    const handleOpenCamera = (disablePhoto?: boolean, disableVideo?: boolean) => {
        openCameraComponent(cameraCallback, disablePhoto, disableVideo);
    };

    const handleOpenGallery = (type?: 'image' | 'video' | 'both', enableLink?: boolean) => {
        openGalleryPicker(galleryCallback, true, type, enableLink);
    };

    const handleOpenConactPicker = () => {
        openContactPicker(contactPickerCallback);
    };

    const handleOpenEmojiPicker = () => {
        openEmojiPicker(emojiCallback);
    };

    const handleOpenGIFPicker = () => {
        openGIFPicker(gifCallback);
    };

    // Components list
    const componentsList: ComponentList[] = [
        {
            label: getLang('Components:Routing.Title'),
            actions: [
                {
                    label: getLang('Components:Routing.Actions.Page'),
                    onClick: handleNavigateToPage,
                },
            ],
        },
        {
            label: getLang('Components:Camera.Title'),
            actions: [
                {
                    label: getLang('Components:Camera.Actions.Photo'),
                    onClick: () => handleOpenCamera(false, true),
                },
                {
                    label: getLang('Components:Camera.Actions.Video'),
                    onClick: () => handleOpenCamera(true, false),
                },
                {
                    label: getLang('Components:Camera.Actions.Both'),
                    onClick: () => handleOpenCamera(false, false),
                },
            ],
        },
        {
            label: getLang('Components:Gallery.Title'),
            actions: [
                {
                    label: getLang('Components:Gallery.Actions.Photos'),
                    onClick: () => handleOpenGallery('image'),
                },
                {
                    label: getLang('Components:Gallery.Actions.Videos'),
                    onClick: () => handleOpenGallery('video'),
                },
                {
                    label: getLang('Components:Gallery.Actions.Both'),
                    onClick: () => handleOpenGallery('both'),
                },
                {
                    label: getLang('Components:Gallery.Actions.PhotosWithLinks'),
                    onClick: () => handleOpenGallery('image', true),
                },
            ],
        },
        {
            label: getLang('Components:Contacts.Title'),
            actions: [
                {
                    label: getLang('Components:Contacts.Actions.OpenPicker'),
                    onClick: handleOpenConactPicker,
                },
            ],
        },
        {
            label: getLang('Components:Utils.Title'),
            actions: [
                {
                    label: getLang('Components:Utils.Actions.OpenGIFPicker'),
                    onClick: handleOpenGIFPicker,
                },
                {
                    label: getLang('Components:Utils.Actions.OpenEmojiPicker'),
                    onClick: handleOpenEmojiPicker,
                },
            ],
        },
    ];

    return (
        <div className='px-4 pt-10 bg-white dark:bg-[#03050B] w-full flex flex-col gap-9'>
            <div className='flex flex-col items-center justify-center gap-4'>
                <div className='size-16 rounded-[10px] bg-gradient-to-br from-[#7DA6FF] to-[#1A63FF] flex items-center justify-center text-white'>
                    <Hammer className='size-8' />
                </div>
                <div className='flex flex-col gap-1'>
                    <p className='text-xs font-extrabold uppercase bg-gradient-to-br from-[#7DA6FF] to-[#1A63FF] bg-clip-text text-transparent text-center'>
                        17mov Phone
                    </p>
                    <h2 className='text-[20px] font-extrabold text-black dark:text-white text-center'>
                        {getLang('Welcome').replace('%s', getLang('app_name'))}
                    </h2>
                </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col items-center justify-center gap-2.5'>
                    <div className='size-10 rounded-[5px] bg-gradient-to-br from-[#84FF7D] to-[#088F01] flex items-center justify-center text-white'>
                        <CardSim className='size-5' />
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <p className='text-xs text-[#7A7E96] font-normal'>{getLang('Settings:Number')}</p>
                        <h3 className='text-black dark:text-white font-bold text-sm'>{getCurrentNumber()}</h3>
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center gap-2.5'>
                    <div className='size-10 rounded-[5px] bg-gradient-to-br from-[#545BFF] to-[#2229B8] flex items-center justify-center text-white'>
                        <SunMoon className='size-5' />
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <p className='text-xs text-[#7A7E96] font-normal'>{getLang('Settings:Theme')}</p>
                        <h3 className='text-black dark:text-white font-bold text-sm'>{getLang(`Settings:Theme.${settings.theme}`)}</h3>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <h3 className='text-black dark:text-white text-base font-bold text-center'>{getLang('Components:Title')}</h3>
                {componentsList.map((component, idx) => (
                    <div key={idx} className='flex flex-col gap-1'>
                        <h4 className='text-black dark:text-white text-xs font-bold'>{component.label}</h4>
                        {component.actions.map((action, actionIdx) => (
                            <button
                                key={actionIdx}
                                type='button'
                                className='flex items-center justify-between text-[#7a7e96] h-10 px-4 py-3 bg-[#7a7e96]/10 rounded-[5px] transition duration-300 hover:bg-[#3239E5] hover:text-white focus:outline-none'
                                onClick={action.onClick}
                            >
                                <span className='font-medium text-xs'>{action.label}</span>
                                <ChevronRight className='size-4' />
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Homepage;
