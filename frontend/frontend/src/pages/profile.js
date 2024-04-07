import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import '../styles/Profile.css';
import Navbar from '../components/navbar';
import Image from 'next/image';
import ComponentProject from '@/components/project_component';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { fetchProjects } from '../../store/projectUser';
import { fetchUserProfile } from '../../store/userSlice';
import { fetchArticles } from '../../store/articleUser';
import ComponentArticle from '@/components/article_component';
import AddProjectModal from '@/components/add_project_modal';
import { patch, post } from '@/utils/api';
import AddArticleModal from '@/components/add_article_modal';




function Profile() {
    const router = useRouter();
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);
    const projectUser = useSelector((state) => state.project.projectsUsers);
    const articleUser = useSelector((state) => state.article.articlesUsers);
    const [selectedMenu, setSelectedMenu] = useState('Perfil');
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
    const [isEditArticleModalOpen, setIsEditArticleModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);


    const projectLabels = {
        invertir: 'Invertir',
        colaborar: 'Colaborar',
    };

    const usersLabels = {
        invertir: 'Invertir',
        colaborar: 'Colaborar',
    };

    const getInitialProjectsFilters = () => {
        if (userInfo) {
            return {
                invertir: userInfo.config.search_projects.invertir,
                colaborar: userInfo.config.search_projects.colaborar,
            };
        }
        return {
            invertir: false,
            colaborar: false,
        };
    };

    const getInitialUsersFilters = () => {
        if (userInfo) {
            return {
                invertir: userInfo.config.search_users.invertir,
                colaborar: userInfo.config.search_users.colaborar,
            };
        }
        return {
            invertir: false,
            colaborar: false,
        };
    };

    const [selectedProjectsFilters, setSelectedProjectsFilters] = useState(getInitialProjectsFilters());
    const [selectedUsersFilters, setSelectedUsersFilters] = useState(getInitialUsersFilters());



    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
        }

        if (projectUser.length === 0) {
            dispatch(fetchProjects());
        }

        if (articleUser.length === 0) {
            dispatch(fetchArticles());
        }

        if (userInfo === null) {
            dispatch(fetchUserProfile());
            setSelectedProjectsFilters(getInitialProjectsFilters());
            setSelectedUsersFilters(getInitialUsersFilters());
        }




    }, [router]);

    const handleMenuSelection = (menu) => {
        setSelectedMenu(menu);
    }

    const handleOpenProjectModal = () => {
        setIsProjectModalOpen(true);
    };

    const handleCloseProjectModal = () => {
        setIsProjectModalOpen(false);
        setIsEditProjectModalOpen(false);
    };

    const handleEditProject = (projectId) => {
        const projectToEdit = projectUser.find(project => project._id === projectId);
        if (projectToEdit) {
            setEditingProject(projectToEdit);
            setIsEditProjectModalOpen(true);
        }
    };


    const handleSaveNewProject = async (name, description, startDate, endDate, categories, country, city, { instagram, twitter, web, linkedin }, searchCollaborators, searchInvestors, projectClosed) => {
        const projectData = {
            name,
            description,
            startDate,
            endDate,
            categories,
            location: { country, city },
            social_media: {
                instagram,
                twitter,
                web,
                linkedin
            },
            searchCollaborators,
            searchInvestors,
            projectClosed
        };

        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            const response = await post('/project', projectData, headers);
            console.log('Proyecto guardado con éxito', response);
            dispatch(fetchProjects());
            handleCloseProjectModal();
        } catch (error) {
            console.error('Error guardando el proyecto', error);
        }


    };

    const handleSaveProject = async (name, description, startDate, endDate, categories, country, city, { instagram, twitter, web, linkedin }, search_collaborators, search_investors, close) => {
        const projectData = {
            name,
            description,
            startDate,
            endDate,
            categories,
            location: { country, city },
            social_media: {
                instagram,
                twitter,
                web,
                linkedin
            },
            search_collaborators,
            search_investors,
            close
        };

        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            const response = await patch(`/project/${editingProject._id}`, projectData, headers);
            console.log('Proyecto guardado con éxito', response);
            dispatch(fetchProjects());
            handleCloseProjectModal();
        } catch (error) {
            console.error('Error guardando el proyecto', error);
        }


    };

    const handleOpenArticleModal = () => {
        setIsArticleModalOpen(true);
    };

    const handleCloseArticleModal = () => {
        setIsArticleModalOpen(false);
        setIsEditArticleModalOpen(false);
    };

    const handleSaveNewArticle = async (name, description, categories, country, city, language) => {
        const articleData = {
            name,
            description,
            categories,
            location: { country, city },
            language,
        };

        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            const response = await post('/article', articleData, headers);
            console.log('Articulo guardado con éxito', response);
            dispatch(fetchArticles());
            handleCloseArticleModal();
        } catch (error) {
            console.error('Error guardando el articulo', error);
        }


    };

    const handleEditArticle = (articleId) => {
        const articleToEdit = articleUser.find(article => article._id === articleId);
        if (articleToEdit) {
            setEditingArticle(articleToEdit);
            setIsEditArticleModalOpen(true);
        }
    };

    const handleSaveArticle = async (name, description, categories, country, city, language) => {
        const articleData = {
            name,
            description,
            categories,
            location: { country, city },
            language,
        };

        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            const response = await patch(`/article/${editingArticle._id}`, articleData, headers);
            console.log('Articulo guardado con éxito', response);
            dispatch(fetchArticles());
            handleCloseArticleModal();
        } catch (error) {
            console.error('Error guardando el articulo', error);
        }


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
                            <p className="name">{userInfo?.name}</p>
                            <p className="location">{userInfo?.location.city + ', ' + userInfo?.location.country}</p>
                            <p className="contacts">{userInfo?.followers.length} seguidores</p>
                            <p className="contacts">{userInfo?.following.length} seguidos</p>
                        </div>

                        <p className="paragraph">{userInfo?.description}</p>
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
                        <div className={`menu-option ${selectedMenu === 'Configuración' ? 'active' : ''}`} onClick={() => handleMenuSelection('Configuración')}>
                            Configuración
                        </div>
                    </div>

                    {selectedMenu === 'Perfil' && (
                        <>
                            <div className="config-container">
                                <p className="title-config">Contacto</p>
                                <p className="contact-label"><strong>Contacto: </strong>{userInfo?.profile.contact.email}</p>
                                <p className="contact-label"><strong>Linkedin: </strong>{userInfo?.profile.contact.linkedin}</p>
                                <p className="contact-label"><strong>Web:</strong> {userInfo?.profile.contact.web}</p>
                                <p className="contact-label"><strong>Twitter:</strong> {userInfo?.profile.contact.twitter}</p>
                                <p className="contact-label"><strong>Instagram: </strong>{userInfo?.profile.contact.instagram}</p>
                            </div>
                            <div className="config-container">
                                <p className="title-config">Habilidades</p>
                                <ul>
                                    {userInfo?.profile.habilities.map((habilities, index) => (
                                        <li key={index} className="profile-list">{habilities}</li>
                                    ))}
                                </ul>

                            </div>
                            <div className="config-container">
                                <p className="title-config">Proyectos</p>
                                <ul>
                                    {userInfo?.profile.projects.map((projects, index) => (
                                        <>
                                            <li key={index} className="profile-list">{projects.name}</li>
                                            <p className="profile-project-location">{projects.location.city}{', '}{projects.location.country}{' '}{format(projects.startDate, "dd/MM/yyyy")} - {format(projects.endDate, "dd/MM/yyyy")}</p>
                                            <p className="profile-project-description">{projects.description}</p>
                                        </>

                                    ))}
                                </ul>

                            </div>
                            <div className="config-container">
                                <p className="title-config">Interéses</p>
                                <ul>
                                    {userInfo?.profile.interest.map((interest, index) => (
                                        <li key={index} className="profile-list">{interest}</li>
                                    ))}
                                </ul>

                            </div>

                            <div className="config-container">
                                <p className="title-config">Idiomas</p>
                                <ul>
                                    {userInfo?.profile.languages.map((language, index) => (
                                        <li key={index} className="profile-list">{language}</li>
                                    ))}
                                </ul>

                            </div>

                        </>

                    )}
                    {selectedMenu === 'Proyectos' && (
                        <>
                            <button className="add-project-button" onClick={handleOpenProjectModal}>
                                + Añadir Proyecto
                            </button>

                            <AddProjectModal
                                isOpen={isProjectModalOpen}
                                onClose={handleCloseProjectModal}
                                onSave={handleSaveNewProject}
                            />

                            <AddProjectModal
                                isOpen={isEditProjectModalOpen}
                                onClose={handleCloseProjectModal}
                                onSave={handleSaveProject}
                                project={editingProject}
                            />

                            {projectUser ? (
                                projectUser.length > 0 ? (
                                    projectUser?.map((project, index) => (
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
                                            own={true}
                                            onEdit={handleEditProject}
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
                            <button className="add-project-button" onClick={handleOpenArticleModal}>
                                + Añadir Artículo
                            </button>

                            <AddArticleModal
                                isOpen={isArticleModalOpen}
                                onClose={handleCloseArticleModal}
                                onSave={handleSaveNewArticle}
                            />

                            <AddArticleModal
                                isOpen={isEditArticleModalOpen}
                                onClose={handleCloseArticleModal}
                                onSave={handleSaveArticle}
                                article={editingArticle}
                            />


                            {articleUser ? (
                                articleUser.length > 0 ? (
                                    articleUser?.map((article, index) => (
                                        <ComponentArticle
                                            key={article._id}
                                            id={article._id}
                                            name={article.name}
                                            city={article.location.city}
                                            country={article.location.country}
                                            own={true}
                                            onEdit={handleEditArticle}
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
                                                onChange={() => { }}
                                                readOnly
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
                                                onChange={() => { }}
                                                readOnly
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

export default Profile;