import React from 'react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '../styles/User.css';
import Navbar from '../components/navbar';
import Image from 'next/image';
import ComponentProject from '@/components/project_component';
import { get, post, put } from '@/utils/api';
import { format } from 'date-fns';


function User() {
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState(null);
    const [articles, setArticles] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState('Perfil');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        async function fetchUser() {
            if (!id) return;

            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            const response = await get(`/user/${id}`, headers);
            setUser(response);
            console.log(response);

        }

        async function fetchProjects() {
            if (!id) return;

            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            const response = await get(`/project/user/${id}`, headers);
            setProjects(response);

        }

        async function fetchArticles() {
            if (!id) return;

            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            const response = await get(`/article/user/${id}`, headers);
            setArticles(response);

        }

        fetchUser();
        fetchProjects();
        fetchArticles();
    }, [id, router]);

    const handleMenuSelection = (menu) => {
        setSelectedMenu(menu);
    }

    const handleFollow = async () => {
        const token = localStorage.getItem('token');

        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        const response = await put(`/user/follow/${id}`, {}, headers);

        setUser(prev => ({ ...prev, follow: true }));


    }

    const handleUnfollow = async () => {
        const token = localStorage.getItem('token');

        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        const response = await put(`/user/unfollow/${id}`, {}, headers);

        setUser(prev => ({ ...prev, follow: false }));


    }

    const handleSendMessageClick = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        console.log(id);

        const body = {
            participantId: id,
        }

        const response = await post(`/chat`, body, headers);

        router.push(`/messages?chatId=${response.chatId}&name=${response.name}`)

    };


    return (
        <>
            <Navbar />
            <div className="background"></div>
            <div className="initial-container">
                <div className="profile-content">
                    <div className="row-profile">
                        <div className="column">
                            <div className="image-container">
                                <Image src="/images/image.jpg" alt="Foto perfil" width={180} height={180} className="image" />
                            </div>
                            <p className="name">{user?.name}</p>
                            <p className="location">{user?.location?.city + ', ' + user?.location?.country}</p>
                            <p className="contacts">{user?.followers?.length} seguidores</p>
                            <p className="contacts">{user?.following?.length} seguidos</p>
                        </div>

                        <div className="column-follow">
                            <p className="paragraph">{user?.description}</p>
                            <div className="buttons">
                                {
                                    user?.follow
                                        ? (<button className="btn-message-user" onClick={handleUnfollow}>Siguiendo</button>)
                                        : user?.heFollows
                                            ? (<button className="btn-follow" onClick={handleFollow}>Seguir también</button>)
                                            : (<button className="btn-follow" onClick={handleFollow}>Seguir</button>)
                                }
                                <button className="btn-message-user" onClick={handleSendMessageClick}>Enviar Mensaje</button>
                            </div>
                        </div>

                    </div>
                    <div className="row_menu">
                        <div className={`menu-option ${selectedMenu === 'Perfil' ? 'active' : ''}`} onClick={() => handleMenuSelection('Perfil')}>
                            Perfil
                        </div>
                        <div className={`menu-option ${selectedMenu === 'Proyectos' ? 'active' : ''}`} onClick={() => handleMenuSelection('Proyectos')}>
                            Proyectos
                        </div>
                        <div className={`menu-option ${selectedMenu === 'Artículos' ? 'active' : ''}`} onClick={() => handleMenuSelection('Artículos')}>
                            Artículos
                        </div>
                    </div>

                    {selectedMenu === 'Perfil' && (
                        <>
                            <div className="config-container">
                                <p className="title-config">Contacto</p>
                                <p className="contact-label"><strong>Contacto: </strong>{user?.profile?.contact?.email}</p>
                                <p className="contact-label"><strong>Linkedin: </strong>{user?.profile?.contact?.linkedin}</p>
                                <p className="contact-label"><strong>Web:</strong> {user?.profile?.contact?.web}</p>
                                <p className="contact-label"><strong>Twitter:</strong> {user?.profile?.contact?.twitter}</p>
                                <p className="contact-label"><strong>Instagram: </strong>{user?.profile?.contact?.instagram}</p>
                            </div>
                            <div className="config-container">
                                <p className="title-config">Habilidades</p>
                                <ul>
                                    {user?.profile?.habilities.map((habilities, index) => (
                                        <li key={index} className="profile-list">{habilities}</li>
                                    ))}
                                </ul>

                            </div>
                            <div className="config-container">
                                <p className="title-config">Proyectos</p>
                                <ul>
                                    {user?.profile?.projects.map((projects, index) => (
                                        <>
                                            <li key={index} className="profile-list">{projects?.name}</li>
                                            <p className="profile-project-location">{projects?.location?.city}{', '}{projects?.location?.country}{' '}{format(projects?.startDate, "dd/MM/yyyy")} - {format(projects?.endDate, "dd/MM/yyyy")}</p>
                                            <p className="profile-project-description">{projects?.description}</p>
                                        </>

                                    ))}
                                </ul>

                            </div>
                            <div className="config-container">
                                <p className="title-config">Interéses</p>
                                <ul>
                                    {user?.profile?.interest.map((interest, index) => (
                                        <li key={index} className="profile-list">{interest}</li>
                                    ))}
                                </ul>

                            </div>

                            <div className="config-container">
                                <p className="title-config">Idiomas</p>
                                <ul>
                                    {user?.profile?.languages.map((language, index) => (
                                        <li key={index} className="profile-list">{language}</li>
                                    ))}
                                </ul>

                            </div>

                        </>

                    )}
                    {selectedMenu === 'Proyectos' && (
                        <>

                            {projects ? (
                                projects.length > 0 ? (
                                    projects?.map((project, index) => (
                                        <ComponentProject
                                            key={project._id}
                                            id={project._id}
                                            name={project.name}
                                            date={format(project.startDate, "dd/MM/yyyy") + ' - ' + (project.endDate ? format(project?.endDate, "dd/MM/yyyy") : 'Actualidad')}
                                            description={project.description}
                                            collaborators={project.collaborators}
                                            investors={project.investors}
                                            media={project.social_media}
                                            categories={project.categories}
                                            closed={project.close}
                                            search_collaborators={project.search_collaborators}
                                            search_investors={project.search_investors}
                                            save={project.save}
                                            investment_request={project.investment_request}
                                            collaboration_request={project.collaboration_request}
                                        />
                                    ))
                                ) : (
                                    <p>No hay proyectos para mostrar.</p>
                                )
                            ) : (
                                <p>Cargando proyectos...</p>
                            )}
                        </>

                    )}
                    {selectedMenu === 'Artículos' && (
                        <>

                            {articles ? (
                                articles.length > 0 ? (
                                    articles?.map((article, index) => (
                                        <ComponentArticle
                                            key={article._id}
                                            id={article._id}
                                            name={article.name}
                                            location={article.location.city + ', ' + article.location.country}
                                        />
                                    ))
                                ) : (
                                    <p>No hay artículos para mostrar.</p>
                                )
                            ) : (
                                <p>Cargando artículos...</p>
                            )}
                        </>

                    )}



                </div>
            </div>
        </>


    );
}

export default User;