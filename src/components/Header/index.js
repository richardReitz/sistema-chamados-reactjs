import {useContext} from 'react';
import './header.css';
import avatar from '../../assets/avatar.png';
import { AuthContext } from '../../contexts/auth';
import {Link} from 'react-router-dom';
import { FiHome, FiSettings, FiUsers } from "react-icons/fi";

function Header() {
  const{ user } = useContext(AuthContext);

  return (
    <div className='sidebar'>
        <div className='back-image'>
            <img src={user.avatarUrl === null ? avatar : user.avatarUrl } alt="Foto avatar" />
        </div>
        <Link to="/dashboard">
            <FiHome color="#FFF" size={24}/>
            Chamados
        </Link>
        <Link to="/customers">
            <FiUsers color="#FFF" size={24}/>
            Novo cliente
        </Link>
        <Link to="/profile">
            <FiSettings color="#FFF" size={24}/>
            Configurações
        </Link>
    </div>
  );
}

export default Header;
