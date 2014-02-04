define(function() {

    function Mesh2AABB (mesh) {
        var vertices = mesh.verticesInWord;
        var vertex = vertices[0];

        this.min = vertex.clone();
        this.max = vertex.clone();

        for (var i = 1, length = vertices.length; i < length; i++) {
            vertex = vertices[i];
            if (this.min.x > vertex.x) this.min.x = vertex.x;
            else if (this.max.x < vertex.x) this.max.x = vertex.x;

            if (this.min.y > vertex.y) this.min.y = vertex.y;
            else if (this.max.y < vertex.y) this.max.y = vertex.y;

            if (this.min.z > vertex.z) this.min.z = vertex.z;
            else if (this.max.z < vertex.z) this.max.z = vertex.z;
        }
    }

    return Mesh2AABB;
});
