import React, {useEffect, useRef, useState} from 'react';
import useSWR from 'swr'

import './select-manager-dropdown.scss';

function SelectManagerDropdown({initialManager, updateManager}) {

  const [selectedManager, setSelectedManager] = useState(initialManager || null);
  const [dropdownActive, setDropdownActive] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [activeItem, setActiveItem] = useState(null);
  const containerRef = useRef(null);

  function showDropdown() {
    setDropdownActive(true)
    // todo: add keyDown/up/enter listeners
    // todo: add scrollListener? maybe?
  }
  function hideDropdown() {
    // give time for clicks to pass through
    setTimeout(()=>{
      setDropdownActive(false);
    }, 300)
    // todo: clear listeners
  }
  function searchChange(string) {
    if (dropdownActive) {
      setSearchString(string)
    }
  }
  function selectManager(manager) {
    console.log(manager)
    setSelectedManager(manager)
    setDropdownActive(false)
    setSearchString('')
    updateManager && updateManager(manager) // todo: in the production version, the parent would be notified or an endpoint would be called here
  }

  return (
    <div className="select-manager-dropdown" ref={containerRef}>
      <input className="select-manager-dropdown__input"
             type="text"
             autoComplete="off"
             value={dropdownActive ? searchString : selectedManager?.attributes?.name || '' }
             placeholder="Choose Manager"
             onFocus={showDropdown}
             onBlur={hideDropdown}
             onChange={(e) => searchChange(e.target.value)}
      />
      <ChevronIcon up={dropdownActive}></ChevronIcon>
        { !!dropdownActive && <SelectManagerDropdownScroll searchString={searchString}
                                                           selectManager={selectManager}
                                                           activeItem={activeItem}
                                                           style={{width: containerRef?.current?.offsetWidth || 'auto'}}
                                                           setActiveItem={setActiveItem}></SelectManagerDropdownScroll> }
    </div>
  );
}


// **************** Child components *****************

function SelectManagerDropdownScroll({searchString, selectManager, activeItem, setActiveItem, style}) {
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR('https://gist.githubusercontent.com/daviferreira/41238222ac31fe36348544ee1d4a9a5e/raw/5dc996407f6c9a6630bfcec56eee22d4bc54b518/employees.json', fetcher)

  // not sure if this is a proper way of doing this?
  useEffect(() => {
    if(data?.data?.length) {
      setActiveItem(0)
    }
  }, [data, setActiveItem]);

  if(!data) {
    return( error ? <p>error, please reload</p> : <p>Loading...</p>)
  }
  return(
    <div className="select-manager-dropdown__scroll" style={style}>
      {data.data.filter((m)=> !searchString || checkFullNameMatch(m, searchString)).map((manager, i) => <SelectManagerDropdownItem manager={manager} selectManager={selectManager} active={activeItem===i} key={manager.id}> </SelectManagerDropdownItem>)}
    </div>
  )

}

function SelectManagerDropdownItem({manager, selectManager, active}) {

  return(
    <div className={`select-manager-dropdown__item ${!!active && 'select-manager-dropdown__item--active'}`} onClick={()=>selectManager(manager)}>
      <div className="select-manager-dropdown__item__avatar">
        {initials(manager)}
      </div>
      <div className="select-manager-dropdown__item__details">
        <div className="select-manager-dropdown__item__name" onClick={()=>selectManager(manager)}>
          {manager.attributes.name}
        </div>
        <div className="select-manager-dropdown__item__email" onClick={()=>selectManager(manager)}>
          {manager.attributes.email} // todo dummy@email
        </div>
      </div>
    </div>
  )

}

function ChevronIcon({up}) {
  return (<svg style={{transform: `scale(${!up ? '-1' : '1'})`}} className="select-manager-dropdown__chevron" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>)
}


// **************** utility functions *****************

function initials(manager) {
  // Note: in case we ever need to support multiple middle names, this would be easier to scale:
  // manager.attributes.name.split(' ').map((string)=> string[0]).join('');
  return (manager.attributes.firstName?.[0] || '') + (manager.attributes.lastName?.[0] || '')
}

function checkFullNameMatch(manager, searchString) {
  if(!searchString) {
    return true
  }
  const cleanedNames = [manager.attributes.firstName || '', manager.attributes.lastName || ''].map((string) => string.toLowerCase().replace(/ /g, ""))
  const cleanSearchString = searchString.toLowerCase().replace(/ /g, "")
  const normalOrderMatch = cleanedNames.join('').indexOf(cleanSearchString) > -1
  const reverseOrderMatch =  cleanedNames.reverse().join('').indexOf(cleanSearchString) > -1

  return  normalOrderMatch || reverseOrderMatch
}


export default SelectManagerDropdown;
