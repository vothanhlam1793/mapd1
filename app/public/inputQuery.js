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