import React, {useState} from 'react';
import useSWR from 'swr'

import './select-manager-dropdown.scss';

function SelectManagerDropdown({initialManager, updateManager}) {
  // todo: dummydata, remove
  initialManager = {"type":"employees","id":"323","links":{"self":"http://localhost:3000/v1/employees/323"},"attributes":{"identifier":null,"firstName":"Harriet","lastName":"McKinney","name":"Harriet McKinney","features":["engagement"],"avatar":null,"employmentStart":"2016-01-31T00:00:00.000Z","external":false,"Last Year Bonus":3767,"Business Unit":"Sales","Commute Time":34,"Age":"1984-02-08","Department":"Customer Care","Gender":"Female","Job Level":"Manager","Local Office":"Kuala Lumpur","% of target":88,"Region":"APAC","Salary":76000,"Tenure":"2014-05-31"},"relationships":{"company":{"data":{"type":"companies","id":"5"}},"account":{"data":{"type":"accounts","id":"324"}},"phones":{"data":[]},"Manager":{"data":{"type":"employees","id":"201"}}}}
  const [selectedManager, setSelectedManager] = useState(initialManager || null);
  const [dropdownActive, setDropdownActive] = useState(false);
  const [searchString, setSearchString] = useState('');

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
    setSelectedManager(manager)
    setDropdownActive(false)
    setSearchString('')
    updateManager && updateManager(manager) // todo: in the production version, the parent would be notified or an endpoint would be called here
  }

  return (
    <>
      <input className="select-manager-dropdown__input"
             type="text"
             autoComplete="off"
             value={dropdownActive ? searchString : managerName(selectedManager) }
             placeholder="Please select your manager"
             onFocus={showDropdown}
             onBlur={hideDropdown}
             onChange={(e) => searchChange(e.target.value)}
      />
        { !!dropdownActive && <SelectManagerDropdownScroll searchString={searchString} selectManager={selectManager}></SelectManagerDropdownScroll> }
    </>
  );
}


// **************** Child components *****************

function SelectManagerDropdownScroll({searchString, selectManager}) {
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR('https://gist.githubusercontent.com/daviferreira/41238222ac31fe36348544ee1d4a9a5e/raw/5dc996407f6c9a6630bfcec56eee22d4bc54b518/employees.json', fetcher)

  if(!data) {
    return( error ? <p>error...</p> : <p>Loading...</p>)
  }
  return(
    <div className="select-manager-dropdown__scroll">
      {data.data.filter((m)=> !searchString || checkFullNameMatch(m, searchString)).map((manager) => <SelectManagerDropdownItem manager={manager} selectManager={selectManager} key={manager.id}> </SelectManagerDropdownItem>)}
    </div>
  )

}

function SelectManagerDropdownItem({manager, selectManager}) {

  return(
    <div onClick={()=>selectManager(manager)}>
      {manager.attributes.firstName} {manager.attributes.lastName}
    </div>
  )

}


// **************** utility functions *****************

function managerName(manager) {
  console.log(manager)
  return manager ? [manager.attributes.firstName || '', manager.attributes.lastName || ''].join(' ') : '';
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
