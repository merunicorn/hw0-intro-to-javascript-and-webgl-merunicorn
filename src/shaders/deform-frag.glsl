#version 300 es

precision highp float;
//attribute float cos;
//attribute float sin;

uniform int u_Time;
uniform vec4 u_Color; // The color with which to render this instance of geometry.

// These are the interpolated values out of the rasterizer, so you can't know
// their specific values without knowing the vertices that contributed to them
in vec4 fs_Nor;
in vec4 fs_LightVec;
in vec4 fs_Col;

out vec4 out_Col; // This is the final output color that you will see on your
                  // screen for the pixel that is currently being processed.

void main()
{
    vec4 diffuseColor = u_Color;
    float t = dot(normalize(fs_Nor), normalize(fs_LightVec));
    t = clamp(t, 0.0, 1.0);

    vec3 a, b, c, d;
    a = vec3(0.068, 0.428, 0.318);
    b = vec3(0.988, 0.238, 0.358);
    c = vec3(1.961, 1.08, 0.325);
    d = vec3(0.517, 0.927, -0.213);
    float cosX = float(u_Time) * 3.14159 * 0.01;
    float sinY = float(u_Time) * 3.14159 * 0.01;
    d *= vec3(cos(cosX),sin(sinY),1);

    out_Col = vec4(a[0] + b[0] + cos(1.3 * 3.14159 * (c[0] * t + d[0])),
                   a[1] + b[1] + cos(1.3 * 3.14159 * (c[1] * t + d[1])),
                   a[2] + b[2] + cos(1.3 * 3.14159 * (c[2] * t + d[2])),
                   diffuseColor.a);
}
