const passwordValidator = require('password-validator');
 
// On crée un Schéma
const schema = new passwordValidator();
 
// On y ajoute des propriétés
schema
.is().min(8)  // 8 caratères minimum
.is().max(100)   // 100 caractères maximum
.has().uppercase()  // Avoir des lettres en majuscules
.has().lowercase()  // Avoir des lettres en minuscules
.has().digits(2)  // Avoir 2 chiffres minimum
.has().not().spaces() // Ne doit pas avoir d'espaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Listes noire de mot de passe

module.exports = schema;