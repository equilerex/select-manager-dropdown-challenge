# Manager select
### A frontend coding challenge solution by Joosep Kõivistik

##  [🚀🚀 Live Demo 🚀🚀](https://lively-malasada-854894.netlify.app/)

---

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser. 


### `npm test` 

### `npm run build`   


## Notes / Possible improvements / Issues
- I could only spare one evening and morning on this (crazy week and off to a vacation the next). so mostly an MVP rather than all the extra bells and whistles  
- I made it as a manager specific component as specified in the challenge - This way it would be faster to code and review. In real life however, this should be built as a generic reusable "dropdown" component. Also, many elements should be their own separate standalone atomic components which could be used anywhere - fx avatar, the dropdown item.
- Its responsive but ideally, the mobile behavior should be adressed on its own (either going with native select or adjusting the design accordingly)
- Adding animations for slide in / out (too short on time to figure out the react approaches)
- Could be more unit tests but im lacking some react specific knowledge and for the moment, im out of time to research that ;)
- Note that I have maybe a day of react experience at this point, so most likely issues with:
  - where should different methods / files / entities  best be located
  - naming conventions / capital letter / camel case use  
  - general file structuring - having so much code in the same file feels odd... might be doing something wrong there
  - life cycle hooks / passing between nested components - looks like way too much bootstrapping? must be a cleaner way.
- Acceptance criteria fulfilled and tested. additionally:
  - search works both ways (firstName + lastName ===  lastName + firstName)
  - escape key closes and un-focuses the dropdown
  - endpoint loading and error states
  - loads managers only upon interaction with the dropdown
  -  added some fallbacks in case of faulty / missing data (possibly redundant in case were 100% confident in the data... but real life shows thats often not the case)



## User story

As a user, I am able to filter managers so I can pick the desired one
![sketch](/public/sketch.png)

## Acceptance criteria

- When user clicks into the input field, he/she sees the full list of managers.

- The list shows up to 2 managers, the rest can be seen by scrolling inside the list.

- When user starts typing into the input field, matching results appear in the list.

- Managers are filtered on both first name and last name.

- Filtering is case insensitive.

- Managers are filtered across first name and last name (eg. “tMc” => Harriet McKinnley.)

- When user confirms the selection with the enter key, the full name of the selected manager is displayed in the input field and the list of available managers hides. (Bonus)

- User can navigate the list of managers with arrow up and arrow down keys. (Bonus)

- When the input loses focus, the list of available managers disappears and the entered value is being kept.

- When the user clicks back into the input field a list of filtered managers by the kept value is shown.


