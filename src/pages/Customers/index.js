import {useState} from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import {FiUsers} from 'react-icons/fi';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';

function Customers() {
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');

  async function handleAdd(e){
    e.preventDefault();

    if(nomeFantasia !== '' && cnpj !== '' && endereco !== ''){
      await firebase.firestore().collection('customers')
      .add({
        nomeFantasia: nomeFantasia,
        cnpj: cnpj,
        endereco: endereco
      }).then(()=>{
        setNomeFantasia('');
        setCnpj('');
        setEndereco('');
        toast.success('Empresa cadastrada com sucesso!')
      })
      .catch((error)=>{
        console.log(error);
        toast.error('Erro ao cadastrar empresa');
      })
    }else{
      toast.error('Preencha todos os campos!');
    }
  }

  return (
    <div>
      <Header/>
      <div className='content'>
        <Title name="Clientes">
          <FiUsers size={24}/>
        </Title>

        <div className='container'>
          <form className='form-profile customers' onSubmit={handleAdd}>
            <label>Nome fantasia</label>
            <input placeholder='Nome da empresa' type="text" value={nomeFantasia}onChange={(e)=> setNomeFantasia(e.target.value)}/>

            <label>CNPJ</label>
            <input placeholder='CNPJ da empresa'type="number" value={cnpj} onChange={(e)=> setCnpj(e.target.value)}/>

            <label>Endereço</label>
            <input placeholder='Endereço da empresa'type="text" value={endereco} onChange={(e)=> setEndereco(e.target.value)}/>
            <button type='submit'>Cadastrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Customers;
