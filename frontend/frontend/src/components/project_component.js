import React, { useState, useEffect } from 'react';
import '../styles/Project.css';
import ComponentUser from './user_component';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../store/projectUser';
import { del, post, put } from '@/utils/api';

const ComponentProject = (props) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);

  const [showMore, setShowMore] = useState(false);
  const [isSaved, setIsSaved] = useState(props.save);
  const [requestedInvestment, setRequestedInvestment] = useState(props.investment_request);
  const [requestedCollaboration, setRequestedCollaboration] = useState(props.collaboration_request);



  const handleNotification = async (type) => {
    const token = localStorage.getItem('token');
    const notification = {
      direction: 'incoming',
      type: type, // 'collaboration_request' || 'investment_request'
      from_user: {
        id: userInfo._id,
        name: userInfo.name,
        image: userInfo.image
      },
      project_id: props.id,
      project_name: props.name,
      status: 'pending'
    };

    try {
      await post('/notification/', notification, { 'Authorization': `Bearer ${token}` });
      if (type === 'collaboration_request') {
        setRequestedCollaboration(true)
      } else {
        setRequestedInvestment(true)
      }
      alert(`Solicitud de ${type === 'collaboration_request' ? 'colaboración' : 'inversión'} enviada.`);
    } catch (error) {
      console.error("Error al crear la notificación:", error);
    }
  };


  const handleDeleteClick = async () => {
    const isConfirmed = confirm('¿Estás seguro de que quieres eliminar este proyecto?');
    if (isConfirmed) {
      const token = localStorage.getItem('token');
      await del(`/project/${props.id}`, { 'Authorization': `Bearer ${token}` })
      dispatch(fetchProjects());

    }
  };

  const handleSaveArticle = async () => {
    const project = {
      _id: props.id
    };

    const token = localStorage.getItem('token');
    await put(`/user/save/project/${props.id}`, project, { 'Authorization': `Bearer ${token}` })
    setIsSaved(true);

  };

  const handleUnsaveArticle = async () => {

    const token = localStorage.getItem('token');
    await put(`/user/unsave/project/${props.id}`, {}, { 'Authorization': `Bearer ${token}` })
    setIsSaved(false)
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(userInfo)



  }, []);

  return (
    <div className="project-card">
      <div className="profile-picture"></div>
      <div className="project-info">
        <div className="project-name">{props.name}</div>
        <div className="project-date">{props.date}</div>
        <button className="more-info-btn" onClick={() => setShowMore(!showMore)}>
          {showMore ? 'Ocultar' : 'Saber más'}
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

        {showMore && (
          <>
            <p className="project-title">Descripción:</p>
            <p>{props.description}</p>
            <p className="project-title">Redes</p>
            <p className="media-title"><strong style={{ marginRight: '0.5em' }}>Web:</strong>{props.media.web}</p>
            <p className="media-title"><strong style={{ marginRight: '0.5em' }}>Linkedin: </strong>{props.media.linkedin}</p>
            <p className="media-title"><strong style={{ marginRight: '0.5em' }}>Instagram: </strong>{props.media.instagram}</p>
            <p className="media-title"><strong style={{ marginRight: '0.5em' }}>Twitter:</strong> {props.media.twitter}</p>

            <p className="project-title">Categorias</p>
            <ul className="project-list">
              {props.categories.map((category, index) => (
                <li key={index} className="">{category}</li>
              ))}
            </ul>
            <p className="project-title">Colaboración:</p>

            {
              props.collaborators.map((project, index) => (
                <ComponentUser
                  key={index}
                  name={project.name}
                  location={project.location.city + ', ' + project.location.country} />
              ))}
            <p className="project-title">Inversión:</p>
            {
              props.investors.map((project, index) => (
                <ComponentUser
                  key={index}
                  name={project.name}
                  location={project.location.city + ', ' + project.location.country} />
              ))}

            {props.search_investors ? (
              <>
                <p className="label-check">Busca inversores</p>
              </>
            ) : (
              <>
                <p className="label-check">No busca inversores</p>
              </>
            )}
            {props.search_collaborators ? (
              <>
                <p className="label-check">Busca colaboradores</p>
              </>
            ) : (
              <>
                <p className="label-check">No busca colaboradores</p>
              </>
            )}
            {props.closed ? (
              <>
                <p className="label-check">Proyecto Cerrado</p>
              </>
            ) : (
              <>
                <p className="label-check">Proyecto no cerrado</p>
              </>
            )}

            <div className="row">
              {
                requestedInvestment ? (
                  <p>Inversión solicitada</p>
                ) : (
                  <button className="btn-invest" onClick={() => handleNotification('investment_request')}>
                    Invertir
                  </button>
                )
              }

              {
                requestedCollaboration ? (
                  <p>Colaboración solicitada</p>
                ) : (
                  <button className="btn-collaborate" onClick={() => handleNotification('collaboration_request')}>
                    Colaborar
                  </button>
                )
              }

            </div>

          </>

        )}
      </div>
    </div>
  );
};

export default ComponentProject;
