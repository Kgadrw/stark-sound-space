import StaggeredMenu from "./StaggeredMenu";

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'Music', ariaLabel: 'View music page', link: '/music' },
  { label: 'About', ariaLabel: 'Learn about the artist', link: '/about' },
  { label: 'Tours', ariaLabel: 'See tour dates', link: '/tours' }
];

const socialItems = [
  { label: 'Instagram', link: 'https://www.instagram.com/nelngabo/' },
  { label: 'Twitter', link: 'https://twitter.com/nelngabo' },
  { label: 'YouTube', link: 'https://www.youtube.com/@nelngabo9740' },
  { label: 'Spotify', link: 'https://open.spotify.com/artist/nelngabo' }
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
      accentColor="#ff3fa5"
      isFixed={true}
    />
  );
};

export default Navigation;
