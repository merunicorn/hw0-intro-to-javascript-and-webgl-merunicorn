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

    vec3 a, b, c, d;
    a = vec3(0.498, 1.198, 0.958);
    b = vec3(1.188, 0.798, 0.158);
    c = vec3(0.988, 0.768, -0.342);
    d = vec3(-2.372, 0.278, 0.738);
    float cosX = float(u_Time) * 3.14159 * 0.04;
    float sinY = float(u_Time) * 3.14159 * 0.04;
    d -= (cosX, sinY, cosX);

    float difR = diffuseColor.r * 0.5;
    float difG = diffuseColor.g * 0.5;
    float difB = diffuseColor.b * 0.5;
    out_Col = vec4(difR + a[0] + b[0] * cos(1.3 * 3.14159 * t * (c[0] * 1.0 + d[0])),
                   difG + a[1] + b[1] * cos(1.3 * 3.14159 * t * (c[1] * 1.0 + d[1])),
                   difB + a[2] + b[2] * cos(1.3 * 3.14159 * t * (c[2] * 1.0 + d[2])),
                   diffuseColor.a);
}
