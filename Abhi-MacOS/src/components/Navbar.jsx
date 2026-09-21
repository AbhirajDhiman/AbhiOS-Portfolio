import { navLinks, navIcons } from '#constants';
import dayjs from 'dayjs';

const Navbar = () => {
  return (
    <nav>
      <div>
         <img src="/images/logo.svg" alt="Abhi's MacOS" />
        <p className="font-bold">Abhi's MacOS</p>
        <ul>
          {navLinks.map(({ id, name }) => (
            <li key={id}>
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <ul>
          {navIcons.map(({ id, img }) => (
            <li key={id}>
              <img src={img} className="icon-hover" alt={`icon-${id}`} />
            </li>
          ))}
        </ul>
        <time>{dayjs().format('ddd MMM D h:mm A')}</time>
      </div>
    </nav>
  );
};

export default Navbar;
