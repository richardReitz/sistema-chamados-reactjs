import {useState, useEffect, useContext} from 'react';
import './new.css';
import { useParams, useHistory } from 'react-router-dom';
import Header from '../../components/Header';
import Title from '../../components/Title';
import {FiPlusCircle} from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify'

export default function New() {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const history = useHistory();

    const [loadingRegister, setLoadingRegister] = useState(false);
    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customersSelected, setCustomersSelected] = useState(0);
    const [idCustomer, setIdCustomer] = useState(false);

    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');

    useEffect(()=>{
        async function loadCustomers(){
            await firebase.firestore().collection('customers')
            .get()
            .then((snapshot)=>{
                let list = [];

                snapshot.forEach((doc)=>{
                    list.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })
                if(list.length === 0){
                    console.log('Nenhuma empresa encontrada!');
                    setCustomers([{id: '1', nomeFantasia: ''}]);
                    setLoadCustomers(false);
                    return;
                }
                setCustomers(list);
                setLoadCustomers(false);

                if(id){
                    loadId(list);
                }
            })
            .catch((error)=>{
                console.log(error);
                setLoadCustomers(false);
                setCustomers([{id: '1', nomeFantasia: ''}]);
            })
        }
        loadCustomers();

    },[id]);

    function handleChangeCustomers(e){
        setCustomersSelected(e.target.value);
    }

    async function loadId(list){
        await firebase.firestore().collection('calls').doc(id)
        .get()
        .then((snapshot)=>{
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento);

            let index = list.findIndex(item => item.id === snapshot.data().clienteId)
            setCustomersSelected(index);
            setIdCustomer(true);
        })
        .catch((err)=>{
            console.log('Erro ao encontrar id: ', err);
        })
    }

    async function handleRegister(e){
        e.preventDefault();

        if(idCustomer){
            await firebase.firestore().collection('calls').doc(id)
            .update({
                cliente: customers[customersSelected].nomeFantasia,
                clienteId: customers[customersSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userUid: user.uid,    
            })
            .then(()=>{
                toast.success('Chamado editado com sucesso!')
                setCustomersSelected(0);
                setComplemento('');
                history.push('/dashboard');
            })
            .catch((err)=>{
                toast.error('Erro ao editar chamado!');
                console.log(err);
            })
            return;
        }

        setLoadingRegister(true);

        await firebase.firestore().collection('calls')
        .add({
            created: new Date(),
            cliente: customers[customersSelected].nomeFantasia,
            clienteId: customers[customersSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userUid: user.uid,
        })
        .then(()=>{
            toast.success('Chamado cadastrado com sucesso!');
            setComplemento('');
            setCustomersSelected(0);
            setLoadingRegister(false);
        })
        .catch((error)=>{
            console.log(error);
            toast.error('Erro no cadastro do chamado!')
            setLoadingRegister(false);
        })
    } 

    function handleChangeSelect(e){
        setAssunto(e.target.value);
    }

    function handleChangeOption(e){
        setStatus(e.target.value);
    }

    return (

    <div>
        <Header/>
        <div className='content'>
            <Title name="Novo chamado">
                <FiPlusCircle size={24}/>
            </Title>
      
            <div className='container'>
                <form className='form-profile' onSubmit={handleRegister}>
                    <label>Cliente</label>
                    {loadCustomers ? (
                        <input type="text" disabled={true} value="Procurando clientes..."/>
                    ) : (
                    <select value={customersSelected} onChange={handleChangeCustomers}>
                        {customers.map((item, index)=>{
                            return(
                               <option key={item.id} value={index}>
                                    {item.nomeFantasia}
                               </option>     
                            )
                        })}
                    </select>
                    )}
                    <label>Assunto</label>
                    <select value={assunto} onChange={handleChangeSelect}>
                        <option value="Suporte">Suporte</option>
                        <option value="Visita Tecnica">Visita Técnica</option>
                        <option value="Financeiro">Financeiro</option>
                    </select>
                    <label>Status</label>
                    <div className='status'>
                        <input
                        type="radio"
                        name="radio"
                        value="Aberto"
                        onChange={handleChangeOption}
                        checked={ status === 'Aberto'}
                        />
                        <span>Em aberto</span>

                        <input
                        type="radio"
                        name="radio"
                        value="Progresso"
                        onChange={handleChangeOption}
                        checked={ status === 'Progresso'}
                        />
                        <span>Em progresso</span>

                        <input
                        type="radio"
                        name="radio"
                        value="Encerrado"
                        onChange={handleChangeOption}
                        checked={ status === 'Encerrado'}
                        />
                        <span>Encerrado</span>
                    </div>
                    
                    <label>Complemento</label>
                    <textarea
                    className='text-area'
                    type="text"
                    placeholder="Comentários sobre o chamado (opcional)"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    />
                    <button type='submit'>{loadingRegister ? 'Carregando...' : 'Registrar'}</button>
                </form>
            </div>
        </div>
    </div>
    );
}