const QL_F_MARKER = `
query ($id: ID!){
  Marker(where: {id: $id}){
    id
    x
    y
    name
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
            x
            y
        }
        title
        content
    }
}
`


const QL_FETCH_MARKER = `
query {
    allMarkers {
      x 
      y
      name
      note
      id
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
            x
            y
        }
        title
        content
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