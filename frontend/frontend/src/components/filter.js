import { useState } from 'react';
import styles from '../styles/Filter.module.css';
import AsyncSelect from 'react-select/async';
import { get } from '@/utils/api';

const loadCountryOptions = async (inputValue) => {
  const countryOptions = [
    { value: 'España', label: 'España' },
    { value: 'francia', label: 'Francia' },
    { value: 'alemania', label: 'Alemania' },
  ];
  return countryOptions.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const loadCityOptions = async (inputValue) => {
  const countryOptions = [
    { value: 'Granada', label: 'Granada' },
    { value: 'Malaga', label: 'Malaga' },
    { value: 'Madrid', label: 'Madrid' },
  ];
  return countryOptions.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const loadLanguageOptions = async (inputValue) => {
  const languageOptions = [
    { value: 'Español', label: 'Español' },
    { value: 'Inglés', label: 'Inglés' },
    { value: 'Francés', label: 'Francés' },
  ];
  return languageOptions.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};


const Filter = (props) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const filterLabels = {
    proyectos: 'Proyectos',
    articulos: 'Artículos',
    usuarios: 'Usuarios',
  };
  const options1Labels = {
    invertir: 'Para invertir',
    colaborar: 'Para colaborar',
    cerrados: 'Cerrados',
  };
  const categoriesLabels = {
    Salud: 'Salud y Bienestar',
    Finanzas: 'Finanzas y Economía',
    Arte: 'Arte y Entretenimiento',
    Comercio: 'Comercio',
    Otros: 'Otros',
  };
  const articlesLabels = {
    invertir: 'Quieren invertir',
    colaboracion: 'Quieren colaborar',
  };

  const [selectedFilters, setSelectedFilters] = useState({
    proyectos: true,
    articulos: false,
    usuarios: false,
  });
  const [selectedOptions1, setSelectedOptions1] = useState({
    invertir: false,
    colaborar: false,
    cerrados: false,
  });
  const [selectedCategories, setSelectedCategories] = useState({
    Salud: false,
    Finanzas: false,
    Arte: false,
    Comercio: false,
    Otros: false,
  });
  const [selectedArticles, setSelectedArticles] = useState({
    invertir: false,
    colaboracion: false,
  });

  const handleExclusiveFilterChange = (filterName) => {
    setSelectedFilters({
      proyectos: false,
      articulos: false,
      usuarios: false,
      [filterName]: !selectedFilters[filterName],
    });
    props.setSelected({
      proyectos: false,
      articulos: false,
      usuarios: false,
      [filterName]: !selectedFilters[filterName],
    })
  };
  const handleStateChange = (setStateFunction, filterName) => {
    setStateFunction(prevState => ({
      ...prevState,
      [filterName]: !prevState[filterName],
    }));
  };

  const handleSearch = async () => {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
    };
    props.setSelected(selectedFilters)

    let queryParameters = {};

    if (selectedFilters.proyectos) {
      console.log('proyectos');
      const optionsSelected = Object.keys(selectedOptions1).filter(option => selectedOptions1[option]);

      if (optionsSelected.length > 0) {
        queryParameters.type = optionsSelected.join(',');
      }
      if (selectedCountry) queryParameters.country = selectedCountry.value;
      if (selectedCity) queryParameters.city = selectedCity.value;

      const categoriesSelected = Object.keys(selectedCategories).filter(category => selectedCategories[category]);
      if (categoriesSelected.length > 0) {
        queryParameters.category = categoriesSelected.join(',');
      }
      console.log(queryParameters.category)

      const queryString = Object.keys(queryParameters)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParameters[key])}`)
        .join('&');

      try {
        const response = await get(`/project/filter?${queryString}`, headers);
        props.setProjects(response);
        console.log(response);
      } catch (error) {
        console.error("Error al realizar la búsqueda de proyectos:", error);
      }

    }
    if (selectedFilters.articulos) {
      console.log('articulos')
      if (selectedCountry) queryParameters.country = selectedCountry.value;
      if (selectedCity) queryParameters.city = selectedCity.value;

      const categoriesSelected = Object.keys(selectedCategories).filter(category => selectedCategories[category]);
      if (categoriesSelected.length > 0) {
        queryParameters.category = categoriesSelected.join(',');
      }

      if (selectedLanguage) queryParameters.language = selectedLanguage.value;

      const queryString = Object.keys(queryParameters)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParameters[key])}`)
        .join('&');

      try {
        const response = await get(`/article/filter?${queryString}`, headers);
        props.setArticles(response);
        console.log(response);
      } catch (error) {
        console.error("Error al realizar la búsqueda de artículos:", error);
      }

    }
    if (selectedFilters.usuarios) {
      console.log('usuarios')
      queryParameters.lookingFor = (selectedArticles.invertir === selectedArticles.colaboracion) ? " " : selectedArticles.invertir ? "invertir" : "colaborar";
      if (selectedCountry) queryParameters.country = selectedCountry.value;
      if (selectedCity) queryParameters.city = selectedCity.value;
      if (selectedLanguage) queryParameters.language = selectedLanguage.value;

      const queryString = Object.keys(queryParameters)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParameters[key])}`)
        .join('&');

      try {
        const response = await get(`/user/filter?${queryString}`, headers);
        props.setUsers(response)
      } catch (error) {
        console.error("Error al realizar la búsqueda:", error);
      }

    }
  };

  return (
    <div className={styles.filter_component}>
      <h3>Filtros</h3>
      <div className={styles.filter_options}>
        {Object.entries(filterLabels).map(([filterName, label]) => (
          <label key={filterName}>
            <input
              type="checkbox"
              checked={selectedFilters[filterName]}
              onChange={() => handleExclusiveFilterChange(filterName)}
            />
            {label}
          </label>
        ))}
      </div>
      <p className={styles.line}>________________________</p>
      {selectedFilters.proyectos && (
        <div className={styles.filter_options}>
          {Object.entries(options1Labels).map(([filterName, label]) => (
            <label key={filterName}>
              <input
                type="checkbox"
                checked={selectedOptions1[filterName]}
                onChange={() => handleStateChange(setSelectedOptions1, filterName)}
              />
              {label}
            </label>
          ))}
        </div>
      )}
      {selectedFilters.usuarios && (
        <>
          <div className={styles.filter_options}>
            {Object.entries(articlesLabels).map(([filterName, label]) => (
              <label key={filterName}>
                <input
                  type="checkbox"
                  checked={selectedArticles[filterName]}
                  onChange={() => handleStateChange(setSelectedArticles, filterName)}
                />
                {label}
              </label>
            ))}
          </div>
          <div className={styles.filter_select}>
            <AsyncSelect
              cacheOptions
              loadOptions={loadLanguageOptions}
              defaultOptions
              placeholder="Selecciona Idioma"
              classNamePrefix="reactSelect"
              onChange={setSelectedLanguage}
            />
          </div>
        </>
      )}
      {selectedFilters.articulos && (
        <div className={styles.filter_select}>
          <AsyncSelect
            cacheOptions
            loadOptions={loadLanguageOptions}
            defaultOptions
            placeholder="Selecciona Idioma"
            classNamePrefix="reactSelect"
            onChange={setSelectedLanguage}
          />
        </div>
      )}
      {(selectedFilters.proyectos || selectedFilters.usuarios) && (
        <>
          <div className={styles.filter_select}>
            <AsyncSelect
              cacheOptions
              loadOptions={loadCountryOptions}
              defaultOptions
              placeholder="Selecciona País"
              classNamePrefix="reactSelect"
              onChange={setSelectedCountry}
            />
          </div>
          <div className={styles.filter_select}>
            <AsyncSelect
              cacheOptions
              loadOptions={loadCityOptions}
              defaultOptions
              placeholder="Selecciona Ciudad"
              classNamePrefix="reactSelect"
              onChange={setSelectedCity}
            />
          </div>
        </>
      )}
      {(selectedFilters.proyectos || selectedFilters.articulos) && (
        <div className={styles.filter_options}>
          {Object.entries(categoriesLabels).map(([filterName, label]) => (
            <label key={filterName}>
              <input
                type="checkbox"
                checked={selectedCategories[filterName]}
                onChange={() => handleStateChange(setSelectedCategories, filterName)}
              />
              {label}
            </label>
          ))}
        </div>
      )}



      <button className={styles.btn_search} onClick={handleSearch}>Buscar</button>

    </div>
  );
};

export default Filter;
