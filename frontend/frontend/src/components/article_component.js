import React, { useState } from 'react';
import { useRouter } from 'next/router';
import '../styles/Network.css';
import Image from 'next/image';
import { del, put } from '@/utils/api';
import { fetchArticles } from '../../store/articleUser';
import { useDispatch, useSelector } from 'react-redux';

const ComponentArticle = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isSaved, setIsSaved] = useState(props.save);

  const handleDeleteClick = async () => {
    const isConfirmed = confirm('¿Estás seguro de que quieres eliminar este artículo?');
    if (isConfirmed) {
      const token = localStorage.getItem('token');
      await del(`/article/${props.id}`, { 'Authorization': `Bearer ${token}` })
      dispatch(fetchArticles());

    }
  };

  const handleSaveArticle = async () => {
    const articleData = {
      _id: props.id,
      name: props.name,
      location: {
        city: props.city,
        country: props.country,
      }
    };

    const token = localStorage.getItem('token');
    await put(`/user/save/article/${props.id}`, articleData, { 'Authorization': `Bearer ${token}` })
    setIsSaved(true);

  };

  const handleUnsaveArticle = async () => {

    const token = localStorage.getItem('token');
    await put(`/user/unsave/article/${props.id}`, {}, { 'Authorization': `Bearer ${token}` })
    setIsSaved(false)
  };

  return (
    <div className="user-card">
      <div className="user-info">
        <div className="user-name">{props.name}</div>
        <div className="user-location">{props.city + ', ' + props.country}</div>
        <button className="more-info-btn" onClick={() => router.push(`/article?id=${props.id}`)}>
          Ver más
        </button>
        {props.own ? (
          <>
            <div className="edit-btn" onClick={() => props.onEdit(props.id)} style={{ cursor: 'pointer' }}>
              <Image src="/images/Edit.png" alt="editar" width={30} height={30} />
            </div>
            <div className="delete-btn" onClick={handleDeleteClick} style={{ cursor: 'pointer' }}>
              <Image src="/images/Delete.png" alt="eliminar" width={30} height={30} />
            </div>
          </>
        ) : (
          isSaved ? (
            <div className="delete-btn" onClick={handleUnsaveArticle} style={{ cursor: 'pointer' }}>
              <Image src="/images/unsave.png" alt="desguardar" width={20} height={20} />
            </div>
          ) : (
            <div className="delete-btn" onClick={handleSaveArticle} style={{ cursor: 'pointer' }}>
              <Image src="/images/save.png" alt="guardar" width={20} height={20} />
            </div>
          )
        )}


      </div>
    </div>
  );
};

export default ComponentArticle;
