<template>
  <v-card flat>
    <v-row no-gutters>
      <v-col cols="12">
        <v-row align="center">
          <v-col cols="12" md="6">
            <v-card-title class="title">Clients</v-card-title>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-end">
            <v-btn
                color="primary"
                depressed
                class="font-weight-bold"
                @click="createDialog= true"
            >
              Create
            </v-btn>
            <v-card-actions>
              <create-dialog
                  @submitCreate="validate"
                  @close="closeCreateDialog"
                  :dialog="createDialog"
              >
                <template #title>
                  <v-card-title>Create new client?</v-card-title>
                </template>
                <template #form>
                  <v-card-text>
                    <v-form ref="createForm">
                      <v-row no-gutters>
                        <v-col cols="12" md="6" class="px-md-5 px-2">
                          <v-text-field
                              label="Enter company name"
                              v-model="name"
                              :rules="rules"
                              outlined
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="px-md-5 px-2">
                          <v-text-field
                              label="Enter company name"
                              outlined
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" class="px-md-5 px-2">
                          <v-text-field
                              label="Enter company name"
                              outlined
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </template>
              </create-dialog>
            </v-card-actions>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12">
        <v-card-text class="px-0">
          <v-data-table
              :headers="headers"
              :items="getClients"
              :items-per-page="10"
              class="elevation-3"
              :loading="isLoading"
              loading-text="Loading... Please wait"
          >
            <template v-slot:item.actions="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-icon
                      v-on="on"
                      v-bind="attrs"
                      small
                      class="mr-2"
                      @click="openEditDialog(item)"
                  >
                    mdi-pencil
                  </v-icon>
                </template>
                <span>Edit client</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-icon
                      v-on="on"
                      v-bind="attrs"
                      small
                      @click="openDeleteDialog(item.id)"
                  >
                    mdi-delete
                  </v-icon>
                </template>
                <span>Delete client</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card-text>
      </v-col>
    </v-row>
    <template v-if="editItem">
      <editDialog
          :client="editItem"
          :dialog="showEditDialog"
          :loading="isLoading"
          @editClient="editClient"
          @no="onClose"
      />
    </template>
    <template>
      <warningDialog
          :dialog="showWarningDialog"
          :id="itemIndex"
          @yes="deleteClientById"
          @no="onClose"
      >
        <template #title>
          <v-card-title class="text-center">
            Are you sure you want <br>
            delete this client?
          </v-card-title>
        </template>
      </warningDialog>
    </template>
  </v-card>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "Clients",
  components: {
    editDialog: ()=> import('../components/dialogs/edit-dialog.vue'),
    warningDialog: ()=> import('../components/dialogs/warning-dialog.vue'),
    createDialog:() => import('../components/dialogs/create-dialog.vue')
  },
  data:() => ({
    headers: [
      { text: 'ID', value: 'id', divider: true },
      { text: 'Title', value: 'title', divider: true },
      {text: '', value: 'actions', sortable: false, align: 'end'}
    ],
    name: null,
    rules: [
      v => !!v || 'This field is required',
    ],
    editItem: null,
    itemIndex: -1,
    showEditDialog: false,
    showWarningDialog: false,
    createDialog: false,
    isLoading: false
  }),
  computed: {
    ...mapGetters('Clients', ['getClientsList']),
    getClients(){
      return this.getClientsList.length ? this.getClientsList : []
    }
  },
   async created() {
      this.isLoading = true
      await this.fetchClients()
      .then((resp)=>{
        if(resp){
          this.isLoading = false
        }
      })
  },
  methods: {
    ...mapActions('Clients', ['fetchClients', 'createClient', 'updateClient', 'deleteClient']),
    ...mapActions('Notifications', ['setNotification']),
    onClose(){
      this.showEditDialog = false
      this.showWarningDialog = false
      this.isLoading = false
    },
    openEditDialog(client){
      this.editItem = {...client}
      this.showEditDialog = true
    },
    openDeleteDialog(id){
      this.itemIndex = id
      this.showWarningDialog = true
    },
    editClient(client){
      this.isLoading = true
      this.updateClient(client)
      .then((resp)=>{
        if(resp){
          this.setNotification({
            active: true,
            color: 'success',
            text: 'Client successfully edited!',
          })
          this.onClose()
        } else {
          this.setNotification({
            active: true,
            color: 'error',
            text: 'Error! Please if you entered all data correctly',
          })
        }
      })
    },
    deleteClientById(index){
      this.deleteClient(index)
        .then((resp)=>{
          if(resp){
            this.setNotification({
              active: true,
              color: 'success',
              text: 'Client successfully deleted!',
            })
            this.onClose()
          } else {
            this.setNotification({
              active: true,
              color: 'error',
              text: 'Error! Please if you entered all data correctly',
            })
          }
        })
    },
    closeCreateDialog(){
      this.createDialog = false
      this.name = null
    },
    validate(){
      if(this.$refs.createForm.validate()){
        const item = {
          title: this.name
        }
        this.createClient(item)
          .then((resp)=>{
            if(resp){
              this.setNotification({
                active: true,
                color: 'success',
                text: 'New Client successfully created!',
              })
              this.closeCreateDialog()
            }
          })
      }
    }
  }
}
</script>

<style scoped>

</style>