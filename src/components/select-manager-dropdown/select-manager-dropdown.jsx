import React, {useEffect, useRef, useState} from "react";

import "./select-manager-dropdown.scss";

function SelectManagerDropdown({ initialManager, updateManager }) {
  const [allManagers, setAllManagers] = useState(null);
  const [filteredManagers, setFilteredManagers] = useState(null);
  const [selectedManager, setSelectedManager] = useState(initialManager || null );
  const [dropdownActive, setDropdownActive] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [highlightedItem, setHighlightedItem] = useState(null);
  const containerRef = useRef(null);
  const highlightRef = useRef(null);
  const inputRef = useRef(null);


  function showDropdown() {
    setDropdownActive(true);
  }

  function hideDropdown() {
    // give time for selectManager clicks to go through
    setTimeout(() => {
      setDropdownActive(false);
    }, 300);
  }

  function searchChange(string) {
      setSearchString(string);
      setFilteredManagers(filterManagersBySearch(allManagers, searchString));
      setHighlightedItem(filteredManagers?.length ? 0 : null);
  }

  function keyboardNavigation(event) {
    switch (event.key) {
      case "ArrowUp":
        if (highlightedItem) {
          setHighlightedItem(highlightedItem-1)
          highlightRef?.current?.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
        }
        break;
      case "ArrowDown":
        if (highlightedItem < filteredManagers.length - 1) {
          setHighlightedItem(highlightedItem+1)
          highlightRef?.current?.scrollIntoView()
        }
        break;
      case "Enter":
        selectManager(filteredManagers[highlightedItem])
        inputRef.current.blur()
        break
      case "Escape":
        inputRef.current.blur()
        break
      default:
        return
    }
  }

  function selectManager(manager) {
    setSelectedManager(manager);
    setDropdownActive(false);
    setSearchString("");

    // in the production version, whe would pass the new value to the parent
    // or call an endpoint around here...
    updateManager && updateManager(manager);
  }

  return (
    <div className="select-manager-dropdown" ref={containerRef}>
      <input
        className="select-manager-dropdown__input"
        type="text"
        autoComplete="off"
        ref={inputRef}
        value={
          dropdownActive
            ? searchString
            : selectedManager?.name || ""
        }
        placeholder="Choose Manager"
        onFocus={showDropdown}
        onBlur={hideDropdown}
        onKeyDown={keyboardNavigation}
        onChange={(e) => searchChange(e.target.value)}
      />
      <ChevronIcon up={dropdownActive}></ChevronIcon>

      {!!dropdownActive && (
        <SelectManagerDropdownScroll
          setAllManagers={setAllManagers}
          filteredManagers={filteredManagers}
          setFilteredManagers={setFilteredManagers}
          searchString={searchString}
          highlightedItem={highlightedItem}
          setHighlightedItem={setHighlightedItem}
          highlightRef={highlightRef}
          selectManager={selectManager}
          style={{ width: containerRef?.current?.offsetWidth || "auto" }}
        ></SelectManagerDropdownScroll>
      )}
    </div>
  );
}

// **************** Child components *****************
function SelectManagerDropdownScroll({selectManager, highlightedItem, highlightRef, style, filteredManagers, setAllManagers, setFilteredManagers, setHighlightedItem, searchString}) {
  const [error, setError] = useState(false);
  // fetch located here to avoid unnecessary calls on page load, only triggers when dropdown is clicked.
  useEffect(() => {
    fetch('https://gist.githubusercontent.com/daviferreira/41238222ac31fe36348544ee1d4a9a5e/raw/5dc996407f6c9a6630bfcec56eee22d4bc54b518/employees.json')
      .then(res => res.json())
      .then(data => {
        // the response is spread between multiple arrays, we need to combine the relevant bits:
        const mergedData = data?.data.map((manager)=>{
          const account = data.included.find((ac) => ac.id === manager.relationships.account.data.id)
          return { name: manager.attributes.name, id: manager.id, firstName: manager.attributes.firstName, lastName: manager.attributes.lastName, email: account.attributes.email}
        })
        setAllManagers(mergedData)
        setFilteredManagers(filterManagersBySearch(mergedData, searchString));
        setHighlightedItem(mergedData.length ? 0 : null)
      }).catch(error => {
        setError(error)
      });
  }, [setAllManagers, setHighlightedItem, setError, searchString, setFilteredManagers])

  // loading and error state
  if (!filteredManagers) {
    return <LoadingStatus error={error}></LoadingStatus>;
  }

  return (
      <div className="select-manager-dropdown__scroll" style={style}>
        {  filteredManagers.length ?
          filteredManagers.map((manager, i) => (
            <ManagerDropdownItem
              highlightRef={i=== highlightedItem ? highlightRef : null}
              manager={manager}
              selectManager={selectManager}
              active={highlightedItem === i}
              key={manager.id}
            ></ManagerDropdownItem>
        )) :
          <div className="select-manager-dropdown__loading-status">No managers found...</div>}
      </div>
  );
}

function LoadingStatus({ error }) {
  // note: a spinner would work better for a quickly changing ui like this, but im in a hurry and spinners take a fair share of effort to write from scratch (and the guide said not to copy code).
  return <div className={`select-manager-dropdown__loading-status ${ !!error ? 'select-manager-dropdown__loading-status--red' : ''}`} >{error ? <p>Sorry, please try and reload the page</p> : <p>Loading...</p>}</div>;
}

function ManagerDropdownItem({ manager, selectManager, active, highlightRef }) {
  return (
    <div className={`select-manager-dropdown__item ${!!active && 'select-manager-dropdown__item--active'}`} onClick={()=>selectManager(manager)} ref={highlightRef}>
      <div className="select-manager-dropdown__item__avatar">
        {initials(manager)}
      </div>
      <div className="select-manager-dropdown__item__details">
        <div className="select-manager-dropdown__item__name" onClick={()=>selectManager(manager)}>
          {manager.name}
        </div>
        <div className="select-manager-dropdown__item__email" onClick={()=>selectManager(manager)}>
          {manager.email}
        </div>
      </div>
    </div>
  );
}

function ChevronIcon({ up }) {
  return (<svg style={{ transform: `scale(${!up ? "-1" : "1"})` }}

               className="select-manager-dropdown__chevron"
               xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none" /><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" /></svg>);
}

// **************** utility functions *****************

function initials(manager) {
  // Note: in case we ever need to support multiple middle names, this would be easier to scale:
  // manager.name.split(' ').map((string)=> string[0]).join('');
  return ((manager.firstName?.[0] || "") + (manager.lastName?.[0] || ""));
}

function filterManagersBySearch(managers, searchString) {
  return managers.filter((m)=> checkFullNameMatch(m, searchString))
}
function checkFullNameMatch(manager, searchString) {
  if (!searchString) {
    return true;
  }
  const cleanedNames = [
    manager.firstName || "",
    manager.lastName || "",
  ].map((string) => string.toLowerCase().replace(/ /g, ""));

  const cleanSearchString = searchString.toLowerCase().replace(/ /g, "");
  const normalOrderMatch = cleanedNames.join("").indexOf(cleanSearchString) > -1;
  const reverseOrderMatch = cleanedNames.reverse().join("").indexOf(cleanSearchString) > -1;

  return normalOrderMatch || reverseOrderMatch;
}

export default SelectManagerDropdown;
