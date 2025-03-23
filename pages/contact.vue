<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header Section -->
    <header class="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white py-6 shadow-md">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl font-bold">Contact Us</h1>
        <p class="mt-2 text-lg">We'd love to hear from you! Reach out with any questions, feedback, or suggestions.</p>
      </div>
    </header>

    <!-- Main Contact Section -->
    <main class="container mx-auto pt-10 pb-20 px-6">
      <div class="grid md:grid-cols-2 gap-10">
        <!-- Contact Form -->
        <section>
          <h2 class="text-2xl font-semibold mb-6">Get in Touch</h2>
          <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg shadow-lg">
            <div class="mb-4">
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
              <input id="name" type="text" v-model="contactForm.name" required placeholder="Enter your full name"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
              <input id="email" type="email" v-model="contactForm.email" required placeholder="Enter your email address"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div class="mb-4">
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject*</label>
              <input id="subject" type="text" v-model="contactForm.subject" required placeholder="Enter subject"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div class="mb-6">
              <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message*</label>
              <textarea id="message" v-model="contactForm.message" required rows="6" placeholder="Enter your message"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>
            <button type="submit"
              class="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md font-medium text-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              Submit
            </button>
          </form>
        </section>

        <!-- Company Information -->
        <section>
          <h2 class="text-2xl font-semibold mb-6">Contact Information</h2>
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <ul class="space-y-4">
              <li class="flex items-start space-x-4">
                <MapPinIcon class="h-6 w-6 text-indigo-500" />
                <span>
                  <strong class="text-gray-800">Address:</strong>
                  <p class="text-gray-600">1234 Street Name, City, State, 56789</p>
                </span>
              </li>
              <li class="flex items-start space-x-4">
                <EnvelopeIcon class="h-6 w-6 text-indigo-500" />
                <span>
                  <strong class="text-gray-800">Email:</strong>
                  <p class="text-gray-600">support@example.com</p>
                </span>
              </li>
              <li class="flex items-start space-x-4">
                <PhoneIcon class="h-6 w-6 text-indigo-500" />
                <span>
                  <strong class="text-gray-800">Phone:</strong>
                  <p class="text-gray-600">+1 (123) 456-7890</p>
                </span>
              </li>
              <li class="flex items-start space-x-4">
                <ClockIcon class="h-6 w-6 text-indigo-500" />
                <span>
                  <strong class="text-gray-800">Working Hours:</strong>
                  <p class="text-gray-600">Mon-Fri: 9 AM - 6 PM</p>
                </span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import { MapPinIcon, EnvelopeIcon, PhoneIcon, ClockIcon } from '@heroicons/vue/24/outline';

export default {
  components: {
    MapPinIcon,
    EnvelopeIcon,
    PhoneIcon,
    ClockIcon
  },
  data() {
    return {
      contactForm: {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    };
  },
  methods: {
    handleSubmit() {
      // Form submission logic
      alert('Form submitted successfully!');
      console.log(this.contactForm);
      // Reset form after submission
      this.contactForm.name = '';
      this.contactForm.email = '';
      this.contactForm.subject = '';
      this.contactForm.message = '';
    }
  }
};
</script>
