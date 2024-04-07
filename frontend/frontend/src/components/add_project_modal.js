import React, { useEffect, useState } from 'react';

const AddProjectModal = ({ isOpen, onClose, onSave, project }) => {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [instagram, setInstagram] = useState('');
    const [twitter, setTwitter] = useState('');
    const [web, setWeb] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [categories, setCategories] = useState([]);
    const [inputCategory, setInputCategory] = useState('');
    const predefinedCategories = ['Tecnología', 'Marketing', 'Diseño', 'Educación', 'Salud'];
    const [searchCollaborators, setSearchCollaborators] = useState(false);
    const [searchInvestors, setSearchInvestors] = useState(false);
    const [projectClosed, setProjectClosed] = useState(false);

    const handleAddCategory = () => {
        if (inputCategory && !categories.includes(inputCategory)) {
            setCategories([...categories, inputCategory]);
            setInputCategory('');
        }
    };

    const handleDeleteCategory = (categoryToDelete) => {
        setCategories(categories.filter(category => category !== categoryToDelete));
    };

    useEffect(() => {
        if (projectClosed) {
            setSearchCollaborators(false);
            setSearchInvestors(false);
        }
    }, [projectClosed]);


    useEffect(() => {
        if (project) {
            setProjectName(project.name || '');
            setProjectDescription(project.description || '');
            setCountry(project.location?.country || '');
            setCity(project.location?.city || '');
            setInstagram(project.social_media?.instagram || '');
            setTwitter(project.social_media?.twitter || '');
            setWeb(project.social_media?.web || '');
            setLinkedin(project.social_media?.linkedin || '');
            setCategories(project.categories || []);
            setSearchCollaborators(project.search_collaborators || false);
            setSearchInvestors(project.search_investors || false);
            setProjectClosed(project.close || false);

            const formattedStartDate = project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '';
            const formattedEndDate = project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '';

            setStartDate(formattedStartDate);
            setEndDate(formattedEndDate);
        } else {
            resetForm();
        }
    }, [project]);


    const resetForm = () => {
        setProjectName('');
        setProjectDescription('');
        setStartDate('');
        setEndDate('');
        setCountry('');
        setCity('');
        setInstagram('');
        setTwitter('');
        setWeb('');
        setLinkedin('');
        setCategories([]);
        setInputCategory('');
        setSearchCollaborators(false);
        setSearchInvestors(false);
        setProjectClosed(false);
    };

    const save = () => {
        if (!projectName || !projectDescription || !startDate || !endDate || categories.length === 0 || !country || !city) {
            alert('Por favor rellena todos los campos');
        }
        else {
            onSave(
                projectName,
                projectDescription,
                startDate,
                endDate,
                categories,
                country,
                city,
                { instagram, twitter, web, linkedin },
                searchCollaborators,
                searchInvestors,
                projectClosed
            );
            resetForm();

        }

    };


    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2 className="modal-title">
                    {project ? 'Editar Proyecto' : 'Añadir Proyecto'}
                </h2>

                <div className="modal-container">
                    <p className='label'>Nombre</p>
                    <input
                        className="modal-input"
                        type="text"
                        value={projectName}
                        onChange={e => setProjectName(e.target.value)}
                    />
                </div>
                <div className="modal-container">
                    <p className='label'>Descripción</p>
                    <textarea
                        className="modal-area"
                        value={projectDescription}
                        onChange={e => setProjectDescription(e.target.value)}
                    />
                </div>
                <div className="modal-container">
                    <p className='label'>Fecha de Comienzo</p>
                    <input
                        className="modal-input"
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                    />
                </div>
                <div className="modal-container">
                    <p className='label'>Fecha de Finalización</p>
                    <input
                        className="modal-input"
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                    />
                </div>
                <div className="modal-container">
                    <p className='label'>Localización</p>
                    <input
                        className="modal-input"
                        type="text"
                        placeholder='Ciudad'
                        value={city}
                        onChange={e => setCity(e.target.value)}
                    />
                    <input
                        className="modal-input"
                        type="text"
                        placeholder='País'
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                    />
                </div>
                <div className="modal-container">
                    <p className='label'>Redes</p>
                    <input
                        className="modal-input"
                        placeholder='web'
                        type="text"
                        value={web}
                        onChange={e => setWeb(e.target.value)}
                    />
                    <input
                        className="modal-input"
                        placeholder='instagram'
                        type="text"
                        value={instagram}
                        onChange={e => setInstagram(e.target.value)}
                    />
                    <input
                        className="modal-input"
                        placeholder='linkedin'
                        type="text"
                        value={linkedin}
                        onChange={e => setLinkedin(e.target.value)}
                    />
                    <input
                        className="modal-input"
                        placeholder='twitter'
                        type="text"
                        value={twitter}
                        onChange={e => setTwitter(e.target.value)}
                    />
                </div>

                <div className="modal-container">
                    <p className='label'>Categoría</p>
                    <input
                        className="modal-input"
                        list="category-list"
                        placeholder='Seleccione o añada una categoría...'
                        value={inputCategory}
                        onChange={e => setInputCategory(e.target.value)}
                    />
                    <datalist id="category-list">
                        {predefinedCategories.map((category, index) => (
                            <option key={index} value={category} />
                        ))}
                    </datalist>
                    <button className='btn-add-category' onClick={handleAddCategory}>Añadir Categoría</button>
                    <div>
                        {categories.map((category, index) => (
                            <div key={index} className='new-categories-list'>
                                <span onClick={() => handleDeleteCategory(category)} style={{ cursor: 'pointer' }}>X{' - '}</span> {category}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="modal-container">
                    <div>
                        <input
                            id="searchCollaborators"
                            type="checkbox"
                            checked={searchCollaborators}
                            onChange={() => setSearchCollaborators(!searchCollaborators)}
                            disabled={projectClosed}
                        />
                        <label htmlFor="searchCollaborators" className='label-checkout'>Busca colaboradores</label>
                    </div>
                    <div>
                        <input
                            id="searchInvestors"
                            type="checkbox"
                            checked={searchInvestors}
                            onChange={() => setSearchInvestors(!searchInvestors)}
                            disabled={projectClosed}
                        />
                        <label htmlFor="searchInvestors" className='label-checkout'>Busca inversores</label>
                    </div>
                    <div>
                        <input
                            id="projectClosed"
                            type="checkbox"
                            checked={projectClosed}
                            onChange={() => setProjectClosed(!projectClosed)}
                        />
                        <label htmlFor="projectClosed" className='label-checkout'>Proyecto cerrado</label>
                    </div>
                </div>
                <button
                    className='btn-save-project'
                    onClick={() => { save() }}
                >
                    Guardar
                </button>
            </div>
        </div>

    );
};

export default AddProjectModal;
