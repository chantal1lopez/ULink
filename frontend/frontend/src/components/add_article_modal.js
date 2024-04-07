import React, { useEffect, useState } from 'react';

const AddArticleModal = ({ isOpen, onClose, onSave, article }) => {
    const [articleName, setArticleName] = useState('');
    const [articleDescription, setArticleDescription] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [categories, setCategories] = useState([]);
    const [inputCategory, setInputCategory] = useState('');
    const predefinedCategories = ['Finanzas', 'Arte', 'Comercio', 'Salud', 'Otro'];
    const [language, setLanguage] = useState('');
    const predefinedLanguages = ['Español', 'Francés', 'Inglés', 'Alemán', 'Italiano'];


    const handleAddCategory = () => {
        if (inputCategory && !categories.includes(inputCategory)) {
            setCategories([...categories, inputCategory]);
            setInputCategory('');
        }
    };

    const handleDeleteCategory = (categoryToDelete) => {
        setCategories(categories.filter(category => category !== categoryToDelete));
    };


    const resetForm = () => {
        setArticleName('');
        setArticleDescription('');
        setCountry('');
        setCity('');
        setCategories([]);
        setInputCategory('');
    };

    const save = () => {
        if (!articleName || !articleDescription || categories.length === 0 || !country || !city || !language) {
            alert('Por favor rellena todos los campos');
        }
        else {
            onSave(
                articleName,
                articleDescription,
                categories,
                country,
                city,
                language,
            );
            resetForm();

        }

    };

    useEffect(() => {
        if (article) {
            setArticleName(article.name);
            setArticleDescription(article.description);
            setCountry(article.location.country);
            setCity(article.location.city);
            setCategories(article.categories || []);
            setLanguage(article.language);
        }
    }, [article]);


    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2 className="modal-title">
                    {article ? 'Editar Artículo' : 'Añadir Artículo'}
                </h2>

                <div className="modal-container">
                    <p className='label'>Nombre</p>
                    <input
                        className="modal-input"
                        type="text"
                        value={articleName}
                        onChange={e => setArticleName(e.target.value)}
                    />
                </div>
                <div className="modal-container">
                    <p className='label'>Descripción</p>
                    <textarea
                        className="modal-area"
                        value={articleDescription}
                        onChange={e => setArticleDescription(e.target.value)}
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
                    <p className='label'>Idioma</p>
                    <input
                        className="modal-input"
                        list="languages-list"
                        placeholder='Seleccione o añada una categoría...'
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                    />
                    <datalist id="languages-list">
                        {predefinedLanguages.map((lanaguage, index) => (
                            <option key={index} value={lanaguage} />
                        ))}
                    </datalist>
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

export default AddArticleModal;
