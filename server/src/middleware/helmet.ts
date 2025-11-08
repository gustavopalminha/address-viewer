
const helmetParameters = {
    contentSecurityPolicy: {
      directives: {
        /**
         * "default-src 'none'":
         * Blocks everything by default. This API should not be serving
         * scripts, styles, images, or fonts. This is the most secure
         * policy for an API.
         */
        defaultSrc: ["'none'"],

        /**
         * "frame-ancestors 'none'":
         * Prevents your API from being embedded in an <iframe>.
         * This stops "clickjacking" attacks.
         */
        frameAncestors: ["'none'"],
      },
    },
}

export default helmetParameters;