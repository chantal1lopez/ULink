import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/Article.css';
import Navbar from '../components/navbar';
import { get } from '@/utils/api';
import { format } from 'date-fns';

function Article() {
    const router = useRouter();
    const { id } = router.query;
    const [article, setArticle] = useState(null);

    useEffect(() => {
        async function fetchArticle() {
            if (!id) return;

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const headers = {
                    'Authorization': `Bearer ${token}`,
                };
                const response = await get(`/article/${id}`, headers);
                setArticle(response);
            } catch (error) {
                console.error('Error al obtener el articulo:', error);
            }
        }

        fetchArticle();
    }, [id, router]);


    return (
        <>
            <Navbar />
            <div className="background"></div>
            <div className="initial-article-container">
                <div className="article-content">
                    <p className="title">{article?.name}</p>
                    <p className="author">{article?.author_name}</p>
                    <p className="date">{article?.date ? format(new Date(article.date), "dd/MM/yyyy") : 'Fecha no disponible'}</p>
                    <div className="buttons">
                        <button className="btn-connect">Más información </button>
                        <button className="btn-message">Guardar</button>
                    </div>

                    <div className="config-article-container">
                        <p>{article?.description}</p>
                    </div>


                </div>
            </div>
        </>
    );
}

export default Article;