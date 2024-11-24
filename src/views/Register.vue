<template>
  <v-container fluid class="fill-height bg-grey-lighten-3">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-2 rounded-lg">
          <v-card-text class="text-center pa-6">
            <h1 class="text-h5 font-weight-bold mb-2">Create Account</h1>
            <p class="text-body-2 text-medium-emphasis mb-6">Join Schuhvana today</p>

            <v-form @submit.prevent="handleRegister" v-model="isFormValid">
              <v-text-field
                v-model="name"
                label="Full Name"
                :rules="nameRules"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-account"
                class="mb-3"
              ></v-text-field>

              <v-text-field
                v-model="email"
                label="Email Address"
                :rules="emailRules"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-email"
                class="mb-3"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                :rules="passwordRules"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                :type="showPassword ? 'text' : 'password'"
                class="mb-6"
              ></v-text-field>

              <v-btn
                block
                color="primary"
                size="large"
                type="submit"
                :loading="loading"
                :disabled="!isFormValid"
              >
                Create Account
              </v-btn>

              <div class="text-center mt-6">
                <span class="text-body-2 text-medium-emphasis">Already have an account?</span>
                <v-btn
                  variant="text"
                  to="/login"
                  class="ms-2"
                >
                  Sign In
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Register',
  data() {
    return {
      isFormValid: false,
      loading: false,
      showPassword: false,
      name: '',
      email: '',
      password: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length >= 2 || 'Name must be at least 2 characters'
      ],
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 8 || 'Password must be at least 8 characters',
        v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
        v => /[0-9]/.test(v) || 'Password must contain at least one number'
      ]
    };
  },
  methods: {
    ...mapActions('user', ['register', 'login']),
    async handleRegister() {
      if (!this.isFormValid) return;
      
      this.loading = true;
      try {
        const userInfo = {
          name: this.name,
          email: this.email,
          password: this.password
        };
        
        await this.register(userInfo);
        await this.login({ email: this.email, password: this.password });
        
        this.$router.push('/');
      } catch (error) {
        console.error('Registration failed:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>