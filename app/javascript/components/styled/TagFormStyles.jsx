export default {
  container: {
    display: 'grid',
    gridTemplateColumns: '10% 40% auto',
    gridTemplateRows: '20% 20% 20% 20% auto',
    gridRowGap: '20px',
    height: 'auto',
  },
  nameLabel: {
    gridColumnStart: 2,
    gridColumnEnd: 3,
    gridRowStart: 1,
    gridRowEnd: 2,
    alignSelf: 'center',
  },
  nameField: {
    gridColumnStart: 3,
    gridColumnEnd: 4,
    gridRowStart: 1,
    gridRowEnd: 2,
  },
  descriptionLabel: {
    gridColumnStart: 2,
    gridColumnEnd: 3,
    gridRowStart: 2,
    gridRowEnd: 3,
    alignSelf: 'center',
  },
  descriptionField: {
    gridColumnStart: 3,
    gridColumnEnd: 4,
    gridRowStart: 2,
    gridRowEnd: 3,
  },
  parentTags: {
    gridColumnStart: 2,
    gridColumnEnd: 3,
    gridRowStart: 3,
    gridRowEnd: 4,
  },
  tagType: {
    gridColumnStart: 2,
    gridColumnEnd: 3,
    gridRowStart: 4,
    gridRowEnd: 5,
  },
  saveButton: {
    gridColumnStart: 2,
    gridColumnEnd: 3,
    gridRowStart: 5,
    gridRowEnd: 6,
    justifySelf: 'left',
  },
}
