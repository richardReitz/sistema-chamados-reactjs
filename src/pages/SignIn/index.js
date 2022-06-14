import {Link} from 'react-router-dom';
import {useState, useContext} from 'react';
import { AuthContext } from '../../contexts/auth';

import logo from '../../assets/logo.png';
import './signin.css';

function SignIn() {
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');

  const { signIn, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e){
    e.preventDefault();

    if(email !== '' && password !== ''){
      signIn(email, password);
    }
  }

  return (
    <div className='container-center'>
      <div className='login-view'>
        <div className='logo-area'>
          <img src={logo} alt="logo" />
        </div>
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <input type="email" placeholder="email@email.com" value={email} onChange={ (e) => setEmail(e.target.value)} />
          <input type="password" placeholder="******" value={password} onChange={ (e) => setPassword(e.target.value)} />
          <button type="submit">{loadingAuth ? 'Carregando...' : 'Acessar'}</button>
          <Link to="/register">Criar uma conta</Link>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
