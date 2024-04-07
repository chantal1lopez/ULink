import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/Network.css';
import Navbar from '../components/navbar';
import ComponentUser from '@/components/user_component';
import { get } from '@/utils/api';
import ComponentArticle from '@/components/article_component';
import ComponentProject from '@/components/project_component';
import { format } from 'date-fns';

function Saved() {
    const [selectedMenu, setSelectedMenu] = useState('Proyectos');
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [articles, setArticles] = useState([]);


    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
        }

        async function fetchArticle() {
            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            const response = await get(`/user/save/article`, headers);
            setArticles(response);

        }
        async function fetchProjects() {


            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            const response = await get(`/user/save/project`, headers);
            setProjects(response);

        }

        fetchArticle();
        fetchProjects();
        console.log('articles, ', articles)
        console.log('porjects, ', projects)


    }, [router]);

    const handleMenuSelection = (menu) => {
        setSelectedMenu(menu);
    }

    return (
        <>
            <Navbar />
            <div className="background"></div>
            <div className="initial-container">
                <div className="network-content">
                    <div className="row-menu-network">
                        <div className={`menu-option-network ${selectedMenu === 'Proyectos' ? 'active-follow' : ''}`} onClick={() => handleMenuSelection('Proyectos')}>
                            Proyectos
                        </div>
                        <div className={`menu-option-network ${selectedMenu === 'Artículos' ? 'active-follow' : ''}`} onClick={() => handleMenuSelection('Artículos')}>
                            Artículos
                        </div>
                    </div>
                    <div className="follo-content">
                        {selectedMenu === 'Proyectos' && (
                            <>
                                {projects && projects.length > 0 ? (
                                    projects.map((project, index) => (
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
                                            own={false}
                                            save={project.save}
                                            investment_request={project.investment_request}
                                            collaboration_request={project.collaboration_request}
                                        />
                                    ))
                                ) : (
                                    <div>No hay proyectos guardados.</div>
                                )}

                            </>
                        )}
                        {selectedMenu === 'Artículos' && (
                            <>
                                {articles && articles.length > 0 ? (
                                    articles.map((article, index) => (
                                        <ComponentArticle
                                            key={article._id}
                                            id={article._id}
                                            name={article.name}
                                            city={article.location.city}
                                            country={article.location.country}
                                            save={article.save}
                                        />

                                    ))
                                ) : (
                                    <div>No hay artículos guardados.</div>
                                )}

                            </>
                        )}


                    </div>


                </div>
            </div>
        </>
    );
}

export default Saved;