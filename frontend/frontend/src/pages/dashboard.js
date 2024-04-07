import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/Dashboard.css';
import Navbar from '../components/navbar';
import Filter from '@/components/filter';
import ComponentUser from '@/components/user_component';
import { format } from 'date-fns';
import ComponentProject from '@/components/project_component';
import ComponentArticle from '@/components/article_component';
import Image from 'next/image';
import Link from 'next/link';
import { get } from '@/utils/api';

function Dashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState({
    proyectos: true,
    articulos: false,
    usuarios: false,
  });
  const [searchQuery, setSearchQuery] = useState('');




  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    }


  }, [router]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    console.log('click')
    const token = localStorage.getItem('token');

    async function fetchChats() {
      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      console.log(selected)

      if (selected.proyectos) {
        const response = await get(`/project/search/${searchQuery}`, headers);
        setProjects(response);

      }

      if (selected.articulos) {
        const response = await get(`/article/search/${searchQuery}`, headers);
        setArticles(response);

      }
      if (selected.usuarios) {
        const response = await get(`/user/search/${searchQuery}`, headers);
        setUsers(response);
      }


    }

    fetchChats()

  }

  return (
    <>
      <Navbar />
      <div className="background"></div>
      <div className="initial-container">
        <div className="filter-container">
          <Filter setUsers={setUsers} setArticles={setArticles} setProjects={setProjects} setSelected={setSelected} />
        </div>
        <div className="dashboard-content">
          <div className="searchBar">
            <div onClick={handleSearch} className="searchIcon">
              <Image src="/images/Search.png" alt="Buscar" width={20} height={20} />
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={handleInputChange}
            />
          </div>
          {selected?.usuarios && users?.map((user, index) => (
            <ComponentUser
              key={user._id}
              name={user?.name}
              location={`${user?.location?.city}, ${user?.location?.country}`}
              id={user._id}
            />
          ))}
          {selected?.proyectos && projects?.map((project, index) => (
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
          ))}
          {selected?.articulos && articles?.map((article, index) => (
            <ComponentArticle
              key={article._id}
              id={article._id}
              name={article.name}
              city={article.location.city}
              country={article.location.country}
            />
          ))}
        </div>
      </div>
    </>


  );
}

export default Dashboard;
