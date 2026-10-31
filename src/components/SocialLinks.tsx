import { siGithub, siLinkedin, type SimpleIcon } from 'simple-icons';
import { tuning } from '../config';

const LINKS: { label: string; href: string; icon: SimpleIcon }[] = [
  { label: 'LinkedIn', href: tuning.links.linkedIn, icon: siLinkedin },
  { label: 'GitHub', href: tuning.links.gitHub, icon: siGithub },
];

export function SocialLinks() {
  return (
    <nav className="social" aria-label="Profiles">
      {LINKS.map(({ label, href, icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d={icon.path} />
          </svg>
        </a>
      ))}
    </nav>
  );
}
