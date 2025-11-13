import StaggeredMenu from "./StaggeredMenu";

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'Music', ariaLabel: 'View music section', link: '/#music' },
  { label: 'Videos', ariaLabel: 'Watch videos', link: '/#videos' },
  { label: 'Tours', ariaLabel: 'See tour dates', link: '/tours' },
  { label: 'Shop', ariaLabel: 'Browse merchandise', link: '/shop' }
];

const socialItems = [
  { label: 'Instagram', link: 'https://instagram.com' },
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'YouTube', link: 'https://youtube.com' },
  { label: 'Spotify', link: 'https://spotify.com' }
];

const Navigation = () => {
  return (
    <StaggeredMenu
      position="right"
      items={menuItems}
      socialItems={socialItems}
      displaySocials={true}
      displayItemNumbering={true}
      menuButtonColor="#fff"
      openMenuButtonColor="#000"
      changeMenuColorOnOpen={true}
      colors={['#1a1a1a', '#000000']}
      accentColor="#fff"
      isFixed={true}
    />
  );
};

export default Navigation;
