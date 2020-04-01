module.exports = {
  "extends": ["airbnb", "prettier"],
  "plugins": ["react"],
  "rules": {
    // React Native has JSX in JS files
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],

    // React Native includes images via require("../images/example.png")
    "global-require": 0,
    'linebreak-style': ["off", "windows"],
    "import/no-unresolved": 0,

    "no-plusplus": 'off',

    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],

    "react/prefer-stateless-function": [2, { "ignorePureComponents": true }],

    "jsx-a11y/label-has-for": [ 2, {
      "components": [ "Label" ],
      "required": {
          "some": [ "nesting", "id" ]
      },
      "allowChildren": false
    }],
    "jsx-a11y/label-has-associated-control": [ "error", {
      "required": {
        "some": [ "nesting", "id"  ]
      }
    }],

    "consistent-return": 0,

    "no-nested-ternary": 0,

    "no-underscore-dangle": ["error", { "allow": ["_this"] }],

    "prefer-destructuring": ["error", {
      "VariableDeclarator": {
        "array": false,
        "object": true
      },
      "AssignmentExpression": {
        "array": false,
        "object": true
      }
    }, {
      "enforceForRenamedProperties": false
    }]

  },
  "parser": "babel-eslint",
  "env": {
    "jest": true,
    "browser": true,
    "es6": true,
  }
};