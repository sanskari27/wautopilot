import { Button, Flex, Image, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { LOGO_WHITE, NAVIGATION } from '../../../config/const';
import useAuth from '../../../hooks/useAuth';

const HomeNavbar = () => {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const handleClick = () => {
		if (isAuthenticated) {
			return navigate(NAVIGATION.DASHBOARD);
		}
		navigate(`${NAVIGATION.AUTH}/${NAVIGATION.LOGIN}`);
	};

	return (
		<div>
			<nav className='navbar   h-[60px] text-accent'>
				<div className='flex items-center px-4 md:px-[5%] h-full justify-start md:justify-between'>
					<div className='w-full md:w-fit h-full flex justify-between space-x-32 items-center'>
						<a href='/'>
							<Flex alignItems={'end'} justifyContent={'center'} gap={'0.75rem'}>
								<Image src={LOGO_WHITE} alt='Logo' width={'40px'} />
								<Text fontSize={'2xl'} className='text-accent font-bold text-2xl'>
									Wautopilot
								</Text>
							</Flex>
						</a>
						<div className='md:inline-block hidden'>
							<ul className='flex gap-12'>
								<li className={`relative cursor-pointer font-medium`}>
									<a href='/#works' className='hover:text-slate-300'>
										What we do
									</a>
								</li>
								<li className={`relative cursor-pointer font-medium`}>
									<a href='/#who' className='hover:text-slate-300'>
										Who we are
									</a>
								</li>
								<li className={`relative cursor-pointer font-medium`}>
									<a href='/#how' className='hover:text-slate-300'>
										How it works
									</a>
								</li>
								{/* <li className={`relative cursor-pointer font-medium`}>
									<a href='/#faq' className='hover:text-slate-300'>FAQ</a>
								</li> */}
							</ul>
						</div>
					</div>
					<div className='inline-block '>
						<ul className='flex gap-6'>
							<li className={`relative cursor-pointer font-medium`}>
								{/* <a href={`/login`} className={`flex items-center}`}> */}
								<Button
									variant={'outline'}
									rounded={'full'}
									className='bg-accent text-primary-dark'
									onClick={handleClick}
								>
									Try Now
								</Button>
								{/* </a> */}
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</div>
	);
};

export default HomeNavbar;
