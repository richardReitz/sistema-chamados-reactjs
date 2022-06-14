import {Link} from 'react-router-dom';
import {useState, useContext, createContext} from 'react';

import { AuthContext } from '../../contexts/auth';
import logo from '../../assets/logo.png';


function SignUp() {
  const{ signUp, loadingAuth } = useContext(AuthContext);

  const[name, setName] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');

  function handleSubmit(e){
    e.preventDefault();

    if(name !== '' && email !== '' && password !== ''){
      signUp(email, password, name);
    }
  }

  return (
    <div className='container-center'>
      <div className='login-view'>
        <div className='logo-area'>
          <img src={logo} alt="logo" />
        </div>
        <form onSubmit={handleSubmit}>
          <h1>Cadastro</h1>
          <input type="text" placeholder="Seu nome" value={name} onChange={ (e) => setName(e.target.value)} />
          <input type="email" placeholder="email@email.com" value={email} onChange={ (e) => setEmail(e.target.value)} />
          <input type="password" placeholder="******" value={password} onChange={ (e) => setPassword(e.target.value)} />
          <button type="submit">{loadingAuth ? 'Carregando...' : 'Cadastrar'}</button>
          <p>Já é cadastrado? <Link to="/">Entrar</Link></p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
