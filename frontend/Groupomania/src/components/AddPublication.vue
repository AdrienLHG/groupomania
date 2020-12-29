<template>
  <!-- Formulaire de création de publication -->
  <b-row align-h="center">
    <b-col sm="8" class="mb-4">
      <b-button size="lg" block v-b-toggle.collapse-1 variant="info">
        Ajouter une publication
      </b-button>
      <b-collapse id="collapse-1" class="mt-2">
        <b-card>
          <b-form-group>

            <!-- Champ texte -->
            <b-form-textarea id="textarea" v-model="content" required :state="content.length >= 7" placeholder="Que voulez-vous dire ?" rows="3" aria-describedby="textarea-help-block"></b-form-textarea>
            <b-form-text id="textarea-help-block">
              Champ requis, minimum 7 caractères.
            </b-form-text>

            <!-- Champ image : parcourir + drag & drop -->
            <p class="mt-4">Ajouter une image ? (facultatif)</p>
            <b-form-file v-model="file" :state="Boolean(file)" accept=".jpg, .jpeg, .png, .gif, .webp" placeholder="Votre fichier..." drop-placeholder="Déposez un fichier ici..."  v-on:change="onImageChange"></b-form-file>
            <p class="mt-2">
              Fichier sélectionné : {{ file ? file.name : "" }}
            </p>

            <!-- Bouton publier -->
            <b-col class="text-center">
              <b-button class="mt-3" type="submit" variant="primary" @click="add">
                <b-icon icon="upload" aria-hidden="true"></b-icon>
                Publier
              </b-button>
            </b-col>
          </b-form-group>
        </b-card>
      </b-collapse>
    </b-col>
  </b-row>
</template>

<script>
import axios from "axios";
import Vue from 'vue';

export default {
  name: "AddPublication",

  data() {
    return {
      content: "",
      file: null,
      textError: false,
      problem: "",
    };
  },

  methods: {
  onImageChange(e){
        console.log(e.target.files[0]);
        this.file = e.target.files[0].name;
        },

    add() {
      if (this.content.length > 6) {
        let formData = new FormData();
        formData.append("image", this.file);
        formData.append("content", this.content);
        let authorization = Vue.$cookies.get('user_session')
          axios.post("http://localhost:3000/api/messages", formData, {
          headers: {
            Authorization: "Bearer " + authorization.token,
            "Content-Type": "multipart/form-data",
            }, 
          })
          .then((response) => {
            console.log (response);
            this.$parent.getPublications();
            Object.assign(this.$data, this.$options.data());
            this.$root.$emit("bv::toggle::collapse", "collapse-1");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.$bvModal.msgBoxOk('Un texte d\'au moins 7 caractères est requis.', {
            title: "Publication impossible !",
            centered: true,
          });
      }
    },
  },
};
</script>

<style>
.custom-file-input:lang(fr) ~ .custom-file-label::after {
  content: "Parcourir";
}
</style>