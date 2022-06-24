import React, {useState} from 'react';
import useSWR from 'swr'

import './select-manager-dropdown.scss';

function SelectManagerDropdown() {
  const [dropdownActive, setDropdownActive] = useState(false);

  function showDropdown() {
    setDropdownActive(true)
  }
  function hideDropdown() {
    setDropdownActive(false)
  }

  return (
    <>
      <input className="select-manager-dropdown__input"
             type="text"
             onClick={showDropdown}
             onBlur={hideDropdown}
      />
        { !!dropdownActive && <SelectManagerDropdownScroll></SelectManagerDropdownScroll> }
    </>
  );
}

function SelectManagerDropdownScroll() {
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR('https://gist.githubusercontent.com/daviferreira/41238222ac31fe36348544ee1d4a9a5e/raw/5dc996407f6c9a6630bfcec56eee22d4bc54b518/employees.json', fetcher)
  console.log(data, error)
  return(
    <h2>Hello world</h2>
  )

}

export default SelectManagerDropdown;
