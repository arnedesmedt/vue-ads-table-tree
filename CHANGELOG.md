## Changelog

#### v1.2.2 - 27/11/2018

- Small improvements
- Update pagination component

#### v1.2.1 - 24/11/2018

- Removed the width property for columns because it's now possible with the styling object.
- Removed the start and end properties used by the pagination template. Now you have to call the pagination pageChange method.
- Seperate config files from the package.json
- Update eslint

#### v1.2.0 - 23/11/2018

- Make a template of the filter input field and label.
- Make a template of the pagination component.
- Review the way of styling the table.
- Don't call a method to execute the render of the table, but use computed properties.

#### v1.1.0 - 23/08/2018

- A table cell can be overwritten with a custom template. So it's possible to use components in the cell.
- Added a timeout when typing in the filter field, if an async call has to be made.

#### v1.0.0 - 15/08/2018

- Initial release.
