import { ChevronLeft } from 'lucide-react';
import { useNavigateWithApps } from '@/hooks/useNavigateWithApps';
import { useLanguage } from '@/hooks/useLanguage';

const Page = () => {
    const { getLang } = useLanguage();
    const navigate = useNavigateWithApps();

    return (
        <div className='pt-10 size-full flex flex-col gap-6'>
            <div className='flex items-center gap-4'>
                <button
                    type='button'
                    onClick={() => navigate('/')}
                    className='size-10 flex items-center justify-center rounded-[10px] bg-[#7A7E96]/15 text-[#7A7E96] hover:bg-[#7A7E96] hover:text-white transition duration-300'
                >
                    <ChevronLeft className='size-4' />
                </button>
                <div className='flex flex-col flex-auto'>
                    <p className='text-xs text-[#7A7E96]'>{getLang('Routing:Page.BackTo')}</p>
                    <h2 className='text-sm font-bold text-black dark:text-white'>{getLang('Routing:Page.Homepage')}</h2>
                </div>
            </div>

            <div className='flex flex-col items-center justify-center flex-auto'>
                <p className='text-sm text-[#7A7E96] text-center'>{getLang('Routing:Page.Description')}</p>
            </div>
        </div>
    );
};

export default Page;
