import { useContext, useState } from 'react';
import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiSettings, FiUpload } from 'react-icons/fi';
import avatar from '../../assets/avatar.png';

import firebase from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';


function Profile() {
  const{ user, signOut, storageUser, setUser } = useContext(AuthContext);

  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imageAvatar, setImageAvatar] = useState(null);

  function handleFile(e){
    if(e.target.files[0]){
      const image = e.target.files[0];

      if(image.type === 'image/jpeg' || image.type === 'image/png'){
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(e.target.files[0]));
      }else{
        alert('Selecione um arquivo do tipo jpg ou png!')
        setImageAvatar(null);
        return null;
    }
    }
  }

  async function handleUpload(){
    const currentUid = user.uid;

    const uploadTask = await firebase.storage()
    .ref(`images/${currentUid}/${imageAvatar.name}`)
    .put(imageAvatar)
    .then(async ()=>{
      
      await firebase.storage().ref(`images/${currentUid}`)
      .child(imageAvatar.name).getDownloadURL()
      .then(async (url)=>{
        let urlFoto = url;

        await firebase.firestore().collection('users')
        .doc(user.uid).update({
          avatarUrl: urlFoto,
          name: name
        })
        .then(()=>{
          let data ={
            ...user,
            avatarUrl: urlFoto,
            name: name
          };
          setUser(data);
          storageUser(data);
        })
      })
    })
  }

  async function handleSave(e){
    e.preventDefault();

    if(imageAvatar === null && name !== ''){
      await firebase.firestore().collection('users').doc(user.uid)
      .update({
        name: name
      })
      .then(()=>{
        let data = {
          ...user,
          name: name
        };
        setUser(data);
        storageUser(data);
      })
    }else if(name !== '' && imageAvatar !== null){
      handleUpload();
    } 
  }


  return (
    <div>
      <Header/>
      <div className='content'>
        <Title name="Meu perfil">
          <FiSettings size={24}/>
        </Title>

        <div className='container'>
          <form className='form-profile' onSubmit={handleSave}>
            <label className='label-avatar'>
              <span>
                <FiUpload size={25} color="#FFF"/>
              </span>
              <input type="file" accept="image/*" onChange={handleFile}/><br/>
              {avatarUrl === null ?
                <img src={avatar} width="250" height="250" alt='Foto perfil'/>
                :
                <img src={avatarUrl} width="250" height="250" alt='Foto perfil'/> 
              }
            </label>
            <label>Nome</label>
            <input type="text" value={name} onChange={(e)=> setName(e.target.value)}/>
            <label>Email</label>
            <input type="email" value={email} disabled={true} />

            <button className="btn-profile" type='submit'>Salvar</button>
          </form>
        </div>
          <div className='container'>
            <button className="btn-profile btn-logout" onClick={()=> signOut()}>Sair</button>
          </div>
      </div>
    </div>
  );
}

export default Profile;
