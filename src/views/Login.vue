<template>
  <v-container fluid class="fill-height bg-grey-lighten-4">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-8" elevation="0" rounded="lg">
          <div class="text-center mb-8">
            <h1 class="text-h4 font-weight-light mb-2" style="letter-spacing: 1.5px;">SCHUHVANA</h1>
            <p class="text-body-1 text-medium-emphasis font-weight-light" style="letter-spacing: 0.5px;">Sign in to your account</p>
          </div>

          <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              :rules="emailRules"
              variant="outlined"
              density="comfortable"
              bg-color="white"
              class="mb-4"
              hide-details="auto"
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              :rules="passwordRules"
              variant="outlined"
              density="comfortable"
              bg-color="white"
              class="mb-6"
              hide-details="auto"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
            ></v-text-field>

            <v-btn
              type="submit"
              block
              color="black"
              size="large"
              :loading="loading"
              class="mb-6"
              style="letter-spacing: 1px;"
            >
              Sign In
            </v-btn>

            <div class="text-center">
              <router-link 
                to="/forgot-password"
                class="text-decoration-none text-caption font-weight-regular"
                style="letter-spacing: 0.5px; color: var(--v-theme-secondary);"
              >
                Forgot your password?
              </router-link>
            </div>
          </v-form>

          <v-divider class="my-6"></v-divider>

          <div class="text-center">
            <p class="text-body-2 text-medium-emphasis mb-4" style="letter-spacing: 0.5px;">
              Don't have an account?
            </p>
            <v-btn
              to="/register"
              variant="outlined"
              block
              color="black"
              size="large"
              style="letter-spacing: 1px;"
            >
              Create Account
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      valid: false,
      loading: false,
      email: '',
      password: '',
      showPassword: false,
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 8 || 'Password must be at least 8 characters'
      ]
    };
  },
  methods: {
    ...mapActions('user', ['login']),
    async handleSubmit() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      try {
        await this.login({ email: this.email, password: this.password });
        this.$router.push('/account');
      } catch (error) {
        console.error('Login failed:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style>
.v-text-field .v-field__input {
  font-size: 0.95rem !important;
  font-weight: 400 !important;
  letter-spacing: 0.5px !important;
}

.v-text-field .v-label {
  font-size: 0.95rem !important;
  font-weight: 400 !important;
  letter-spacing: 0.5px !important;
  color: var(--v-theme-secondary) !important;
}
</style>