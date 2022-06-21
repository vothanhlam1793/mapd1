function graphql(query, variables = {}) {
    return fetch('/admin/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            variables,
            query,
        }),
    }).then(function(result) {
        return result.json();
    });
}

function graphqlfd(query, variables = {}, stream) {
    const body = new FormData()
    body.append(
        "operations",
        JSON.stringify({
        //   operationName: "CreatePick", // The name of the operation from the mutation above
            query: `mutation($data: ProjectCreateInput!){
                createProject(data: $data){
                  id
                  image { 
                      publicUrl
                  }
                }
            }`, // Const from above
            variables: {
                data: variables
            }
        })
    )

    body.append("map", JSON.stringify({ 1: ["variables.data.image"] }))
    body.append("1", stream)

    return fetch('/admin/api', {
        method: 'POST',
        body: body
    }).then(function(result) {
        return result.json();
    });
}

function graphqlfd2(id, variables = {}, stream) {
    const body = new FormData()
    body.append(
        "operations",
        JSON.stringify({
        //   operationName: "CreatePick", // The name of the operation from the mutation above
            query: `mutation($id: ID!, $data: ProjectUpdateInput!){
                updateProject(id: $id, data: $data){
                  id
                  image { 
                      publicUrl
                  }
                }
            }`, // Const from above
            variables: {
                id: id,
                data: variables
            }
        })
    )

    body.append("map", JSON.stringify({ 1: ["variables.data.image"] }))
    body.append("1", stream)

    return fetch('/admin/api', {
        method: 'POST',
        body: body
    }).then(function(result) {
        return result.json();
    });
}