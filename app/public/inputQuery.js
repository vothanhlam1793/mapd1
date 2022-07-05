const QL_F_MARKER = `
query ($id: ID!){
  Marker(where: {id: $id}){
    id
    x
    y
    name
    nameTA
    note
  }
}
`

const QL_F_PROJECT = `
query ($id: ID!){
    Project (where: {id: $id}){
        id
        marker {
            id
            name
            nameTA
            x
            y
        }
        title
        content
        place
        category
        work
        titleTA
        placeTA
        categoryTA
        workTA
        year
        url
    }
}
`


const QL_FETCH_MARKER = `
query {
    allMarkers {
      x 
      y
      name
      nameTA
      note
      id
      projects {
        id
        title
        content
        place
        category
        titleTA
        placeTA
        categoryTA
        workTA
        work
        year
        url
        image {
          publicUrl
        }
        marker {
          id
          name
          nameTA
          x
          y
        }
      }
    }
}
`
const QL_FETCH_HELLO = `
  query {
    allHellos {
      id
      descript
      descriptTA
      title1 title1TA
      title2 title2TA
    }
  }
`
const QL_FETCH_PROJECT = `
query {
    allProjects {
        id
        marker {
            id
            name
            nameTA
            x
            y
        }
        title
        content
        place
        category
        titleTA
        placeTA
        categoryTA
        workTA
        work
        year
        url
    }
}
`

const QL_UPDATE_MARKER = `
mutation update($id: ID!, $x: Int!, $y: Int!, $name: String!, $note: String!) {
    updateMarker (id: $id, data: {x: $x, y: $y, name: $name, note: $note}){
        id
    }
  }
`

const QL_CREATE_MARKER = `
mutation update($x: Int!, $y: Int!, $name: String!, $note: String) {
    createMarker (data: {x: $x, y: $y, name: $name, note: $note}){
      id
    }
  }
`

const QL_CREATE_PROJECT = `
mutation create($title: String!, $content: String!, $marker: ID!){
  createProject(data: {
    title: $title,
    content: $content,
    marker: { 
    	connect: {
        id: $marker
      }
    }
  }){
    id
  }
}
`

const QL_UPDATE_PROJECT = `
mutation create($id: ID!, $title: String!, $content: String!, $marker: ID!){
  updateProject(id: $id, data: {
    title: $title,
    content: $content,
    marker: { 
    	connect: {
        id: $marker
      }
    }
  }){
    id
  }
}
`

const QL_DELETE_MARKER = `
mutation ($id: ID!) {
  deleteMarker(id: $id) {
    id
  }
}
`

const QL_DELETE_PROJECT = `
mutation ($id: ID!) {
  deleteProject(id: $id) {
    id
  }
}
`