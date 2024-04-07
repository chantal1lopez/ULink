import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import '../styles/EditProfile.css';
import Navbar from '../components/navbar';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { fetchUserProfile } from '../../store/userSlice';
import { patch } from '@/utils/api';


function EditProfile() {
    const router = useRouter();
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);
    const [selectedMenu, setSelectedMenu] = useState('Perfil');
    const [user, setUser] = useState(userInfo);
    const [languages, setLanguages] = useState(userInfo?.profile.languages || []);
    const [inputLanguage, setInputLanguage] = useState('');
    const predefinedLanguage = ['Inglés', 'Español', 'Francés', 'Alemán', 'Italiano'];
    const [interest, setInterest] = useState(userInfo?.profile.interest || []);
    const [inputInterest, setInputInterest] = useState('');
    const predefinedInterest = ['Interéses', 'Español', 'Francés', 'Alemán', 'Italiano'];
    const [habilities, setHabilities] = useState(userInfo?.profile.habilities || []);
    const [inputHabilities, setInputHabilities] = useState('');
    const predefinedHabilities = ['Habilidades', 'Español', 'Francés', 'Alemán', 'Italiano'];
    const [projects, setProjects] = useState(userInfo?.profile.projects || []);
    const [inputProject, setInputProject] = useState({
        name: '',
        description: '',
        location: { city: '', country: '' },
        startDate: projects?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: projects?.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
    });



    const projectLabels = {
        invertir: 'Invertir',
        colaborar: 'Colaborar',
    };

    const usersLabels = {
        invertir: 'Invertir',
        colaborar: 'Colaborar',
    };

    const getInitialProjectsFilters = () => ({
        invertir: userInfo?.config?.search_projects?.invertir || false,
        colaborar: userInfo?.config?.search_projects?.colaborar || false,
    });

    const getInitialUsersFilters = () => ({
        invertir: userInfo?.config?.search_users?.invertir || false,
        colaborar: userInfo?.config?.search_users?.colaborar || false,
    });

    const [selectedProjectsFilters, setSelectedProjectsFilters] = useState(getInitialProjectsFilters());
    const [selectedUsersFilters, setSelectedUsersFilters] = useState(getInitialUsersFilters());



    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
        }

        if (userInfo === null) {
            dispatch(fetchUserProfile());
            setUser(userInfo);
            setSelectedProjectsFilters(getInitialProjectsFilters());
            setSelectedUsersFilters(getInitialUsersFilters());
            setLanguages(userInfo?.profile.languages);
            setInterest(userInfo?.profile.interest);
            setHabilities(userInfo?.profile.habilities);
            setProjects(userInfo?.profile.projects);
        }





    }, [router]);

    const handleMenuSelection = (menu) => {
        setSelectedMenu(menu);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');

        if (keys.length > 1) {
            setUser((prevState) => {
                let newState = JSON.parse(JSON.stringify(prevState));

                let lastKey = keys.pop();
                let lastObj = keys.reduce((acc, key) => {
                    if (!acc[key]) acc[key] = {};
                    return acc[key];
                }, newState);

                lastObj[lastKey] = value;
                return newState;
            });
        } else {
            setUser(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleChangeForContact = (e) => {
        const { name, value } = e.target;
        const fieldName = name.split('.')[2];

        setUser((prevState) => ({
            ...prevState,
            profile: {
                ...prevState.profile,
                contact: {
                    ...prevState.profile.contact,
                    [fieldName]: value,
                },
            },
        }));
    };




    const handleAddLanguage = () => {
        if (inputLanguage && !languages.includes(inputLanguage)) {
            setLanguages(prevLanguages => [...prevLanguages, inputLanguage]);
            setInputLanguage('');
        }
    };

    const handleDeleteLanguage = (languageToDelete) => {
        setLanguages(languages.filter(language => language !== languageToDelete));
    };

    const handleAddInterest = () => {
        if (inputInterest && !interest.includes(inputInterest)) {
            setInterest(prev => [...prev, inputInterest]);
            setInputInterest('');
        }
    };

    const handleDeleteInterest = (interestToDelete) => {
        setInterest(interest.filter(interest => interest !== interestToDelete));
    };

    const handleAddHability = () => {
        if (inputHabilities && !habilities.includes(inputHabilities)) {
            setHabilities(prev => [...prev, inputHabilities]);
            setInputHabilities('');
        }
    };

    const handleDeleteHability = (habilitiesToDelete) => {
        setHabilities(habilities.filter(habilities => habilities !== habilitiesToDelete));
    };

    const handleAddProject = () => {
        setProjects(prevProjects => [...prevProjects, inputProject]);
        setInputProject({
            name: '',
            description: '',
            location: { city: '', country: '' },
            startDate: projects.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
            endDate: projects.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        });
    };

    const handleDeleteProject = (indexToDelete) => {
        setProjects(projects.filter((_, index) => index !== indexToDelete));
    };

    const handleProjectChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, key] = field.split('.');
            setInputProject(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [key]: value,
                },
            }));
        } else {
            if (field === 'startDate' || field === 'endDate') {
                value = new Date(value).toISOString().split('T')[0];
            }
            setInputProject(prev => ({
                ...prev,
                [field]: value,
            }));
        }
    };


    const saveProfile = async () => {
        const updatedUser = {
            ...user,
            profile: {
                ...user.profile,
                languages: languages,
                habilities: habilities,
                interest: interest,
                projects: projects,
            },
        };
        console.log(updatedUser)

        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            const response = await patch(`/user/profile`, updatedUser, headers);
            alert('Perfil guardado con éxito')
        } catch (error) {
            console.error('Error guardando el perifl', error);
        }
    };

    const handleProjectsFilterChange = (filterName) => {
        setSelectedProjectsFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: !prevFilters[filterName],
        }));

        setUser(prevUser => ({
            ...prevUser,
            config: {
                ...prevUser.config,
                search_projects: {
                    ...prevUser.config.search_projects,
                    [filterName]: !prevUser.config.search_projects[filterName],
                },
            },
        }));
    };

    const handleUsersFilterChange = (filterName) => {
        setSelectedUsersFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: !prevFilters[filterName],
        }));

        setUser(prevUser => ({
            ...prevUser,
            config: {
                ...prevUser.config,
                search_users: {
                    ...prevUser.config.search_users,
                    [filterName]: !prevUser.config.search_users[filterName],
                },
            },
        }));
    };






    return (
        <>
            <Navbar />
            <div className="background"></div>
            <div className="initial-container">
                <div className="profile-content">
                    <div className="row">
                        <div className="column">
                            <div className="image-container">
                                <Image src="/images/image.jpg" alt="Foto perfil" width={180} height={180} className="image" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Nombre"
                                className="input-profile"
                                value={user?.name}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="location.city"
                                className="input-profile"
                                placeholder="Ciudad"
                                value={user?.location.city}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="location.country"
                                className="input-profile"
                                placeholder="País"
                                value={user?.location.country}
                                onChange={handleChange}
                            />

                        </div>

                        <textarea name="description" className="profile-description" value={user?.description} placeholder="Descripción"
                            onChange={handleChange}></textarea>
                    </div>
                    <div className="row_menu_edit">
                        <div className={`menu-option-edit ${selectedMenu === 'Perfil' ? 'active-edit' : ''}`} onClick={() => handleMenuSelection('Perfil')}>
                            Perfil
                        </div>
                        <div className={`menu-option-edit ${selectedMenu === 'Configuración' ? 'active-edit' : ''}`} onClick={() => handleMenuSelection('Configuración')}>
                            Configuración
                        </div>
                        <div className={`btn-save-edit`} onClick={() => saveProfile()}>
                            Guardar
                        </div>
                    </div>

                    {selectedMenu === 'Perfil' && (
                        <>
                            <div className="config-container">
                                <p className="title-config">Contacto</p>
                                <p className="contact-label">
                                    <strong>Contacto: </strong>
                                    <input
                                        type="text"
                                        name="profile.contact.email"
                                        className="input-profile"
                                        placeholder="email"
                                        value={user?.profile.contact.email}
                                        onChange={handleChangeForContact}
                                    />
                                </p>
                                <p className="contact-label">
                                    <strong>Linkedin: </strong>
                                    <input
                                        type="text"
                                        name="profile.contact.linkedin"
                                        className="input-profile"
                                        placeholder="email"
                                        value={user?.profile.contact.linkedin}
                                        onChange={handleChangeForContact}
                                    />

                                </p>
                                <p className="contact-label">
                                    <strong>Web:</strong>
                                    <input
                                        type="text"
                                        name="profile.contact.web"
                                        className="input-profile"
                                        placeholder="web"
                                        value={user?.profile.contact.web}
                                        onChange={handleChangeForContact}
                                    />
                                </p>
                                <p className="contact-label">
                                    <strong>Twitter:</strong>
                                    <input
                                        type="text"
                                        name="profile.contact.twitter"
                                        className="input-profile"
                                        placeholder="twitter"
                                        value={user?.profile.contact.twitter}
                                        onChange={handleChangeForContact}
                                    />
                                </p>
                                <p className="contact-label">
                                    <strong>Instagram: </strong>
                                    <input
                                        type="text"
                                        name="profile.contact.instagram"
                                        className="input-profile"
                                        placeholder="instagram"
                                        value={user?.profile.contact.instagram}
                                        onChange={handleChangeForContact}
                                    />
                                </p>
                            </div>
                            <div className="config-container">
                                <p className="title-config">Habilidades</p>
                                <div>
                                    {habilities && habilities.map((hability, index) => (
                                        <div key={index} className='new-categories-list'>
                                            <span onClick={() => handleDeleteHability(hability)} style={{ cursor: 'pointer' }}>X{' - '}</span> {hability}
                                        </div>
                                    ))}
                                </div>

                                <input
                                    className="modal-input"
                                    list="habilities-list"
                                    placeholder='Seleccione o añada habilidades...'
                                    value={inputHabilities}
                                    onChange={e => setInputHabilities(e.target.value)}
                                />
                                <datalist id="habilities-list">
                                    {predefinedHabilities.map((category, index) => (
                                        <option key={index} value={category} />
                                    ))}
                                </datalist>
                                <button className='btn-add-category' onClick={handleAddHability}>Añadir Habilidades</button>
                            </div>
                            <div className="config-container">
                                <p className="title-config">Proyectos</p>

                                <div className="project-item">
                                    <input
                                        className='input-profile'
                                        type="text"
                                        placeholder="Nombre del Proyecto"
                                        value={inputProject.name}
                                        onChange={(e) => handleProjectChange('name', e.target.value)}
                                    />
                                    <textarea
                                        className='input-area-profile'
                                        placeholder="Descripción"
                                        value={inputProject.description}
                                        onChange={(e) => handleProjectChange('description', e.target.value)}
                                    />
                                    <input
                                        className='input-profile'
                                        type="text"
                                        placeholder="Ciudad"
                                        value={inputProject.location.city}
                                        onChange={(e) => handleProjectChange('location.city', e.target.value)}
                                    />
                                    <input
                                        className='input-profile'
                                        type="text"
                                        placeholder="País"
                                        value={inputProject.location.country}
                                        onChange={(e) => handleProjectChange('location.country', e.target.value)}
                                    />
                                    <input
                                        className='input-profile'
                                        type="date"
                                        value={inputProject.startDate}
                                        onChange={(e) => handleProjectChange('startDate', new Date(e.target.value))}
                                    />
                                    <input
                                        className='input-profile'
                                        type="date"
                                        value={inputProject.endDate}
                                        onChange={(e) => handleProjectChange('endDate', new Date(e.target.value))}
                                    />
                                </div>

                                <button className='btn-add-category' onClick={handleAddProject}>Añadir Proyecto</button>
                                <ul>
                                    {projects && projects.map((projects, index) => (
                                        <>
                                            <li key={index} className="profile-list">{projects.name}</li>
                                            <p className="profile-project-location">{projects.location.city}{', '}{projects.location.country}{' '}{format(projects.startDate, "dd/MM/yyyy")} - {format(projects.endDate, "dd/MM/yyyy")}</p>
                                            <p className="profile-project-description">{projects.description}</p>
                                            <button className='btn-add-category' onClick={() => handleDeleteProject(index)}>Eliminar Proyecto</button>
                                        </>

                                    ))}
                                </ul>

                            </div>
                            <div className="config-container">
                                <p className="title-config">Interéses</p>
                                <div>
                                    {interest && interest.map((interest, index) => (
                                        <div key={index} className='new-categories-list'>
                                            <span onClick={() => handleDeleteInterest(interest)} style={{ cursor: 'pointer' }}>X{' - '}</span> {interest}
                                        </div>
                                    ))}
                                </div>

                                <input
                                    className="modal-input"
                                    list="interest-list"
                                    placeholder='Seleccione o añada intereses...'
                                    value={inputInterest}
                                    onChange={e => setInputInterest(e.target.value)}
                                />
                                <datalist id="interest-list">
                                    {predefinedInterest.map((category, index) => (
                                        <option key={index} value={category} />
                                    ))}
                                </datalist>
                                <button className='btn-add-category' onClick={handleAddInterest}>Añadir Interés</button>

                            </div>

                            <div className="config-container">
                                <p className="title-config">Idiomas</p>
                                <div>
                                    {languages && languages.map((language, index) => (
                                        <div key={index} className='new-categories-list'>
                                            <span onClick={() => handleDeleteLanguage(language)} style={{ cursor: 'pointer' }}>X{' - '}</span> {language}
                                        </div>
                                    ))}
                                </div>

                                <input
                                    className="modal-input"
                                    list="language-list"
                                    placeholder='Seleccione o añada idiomas...'
                                    value={inputLanguage}
                                    onChange={e => setInputLanguage(e.target.value)}
                                />
                                <datalist id="language-list">
                                    {predefinedLanguage.map((category, index) => (
                                        <option key={index} value={category} />
                                    ))}
                                </datalist>
                                <button className='btn-add-category' onClick={handleAddLanguage}>Añadir Idioma</button>


                            </div>

                        </>

                    )}
                    {selectedMenu === 'Configuración' && (
                        <>
                            <div className="config-container">
                                <p className="title-config">Configuración Recomendación Proyectos</p>
                                <p className="">Buscar proyectos para:</p>
                                <div className="filter-options">
                                    {Object.entries(projectLabels).map(([filterName, label]) => (
                                        <label key={filterName}>
                                            <input
                                                type="checkbox"
                                                checked={selectedProjectsFilters[filterName]}
                                                onChange={() => handleProjectsFilterChange(filterName)}
                                            />
                                            {label}
                                        </label>
                                    ))}
                                </div>

                            </div>
                            <div className="config-container">
                                <p className="title-config">Configuración Recomendación Usuarios</p>
                                <p className="">Buscar usuarios que quieran:</p>
                                <div className="filter-options">
                                    {Object.entries(usersLabels).map(([filterName, label]) => (
                                        <label key={filterName}>
                                            <input
                                                type="checkbox"
                                                checked={selectedUsersFilters[filterName]}
                                                onChange={() => handleUsersFilterChange(filterName)}
                                            />
                                            {label}
                                        </label>
                                    ))}
                                </div>

                            </div>
                        </>

                    )}


                </div>
            </div>
        </>


    );
}

export default EditProfile;