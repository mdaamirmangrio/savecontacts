document.addEventListener("DOMContentLoaded", () => {
  const addContactForm = document.getElementById("addContactForm")
  const contactsList = document.getElementById("contactsList")
  const successModal = document.getElementById("successModal")
  const addAnotherBtn = document.getElementById("addAnotherBtn")
  const closeModalBtn = document.getElementById("closeModalBtn")
  const contactsCount = document.querySelector(".contacts-count")

  const contacts = [
    { name: "Alice Smith", phone: "+1 (555) 987-6543", email: "alice.smith@email.com" },
    { name: "Bob Johnson", phone: "+1 (555) 456-7890", email: "bob.johnson@email.com" },
    { name: "Carol Wilson", phone: "+1 (555) 321-0987", email: "carol.wilson@email.com" },
  ]

  function getInitials(name) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
  }

  function updateContactsCount() {
    contactsCount.textContent = `${contacts.length} contacts`
  }

  function createContactCard(contact, index) {
    return `
            <div class="contact-card">
                <div class="contact-avatar">
                    <span>${getInitials(contact.name)}</span>
                </div>
                <div class="contact-info">
                    <h4>${contact.name}</h4>
                    <p class="contact-phone">${contact.phone}</p>
                    <p class="contact-email">${contact.email}</p>
                </div>
                <div class="contact-actions">
                    <button class="edit-btn" onclick="editContact(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteContact(${index})">Delete</button>
                </div>
            </div>
        `
  }

  function renderContacts() {
    contactsList.innerHTML = contacts.map((contact, index) => createContactCard(contact, index)).join("")
    updateContactsCount()
  }

  function showModal() {
    successModal.classList.add("show")
  }

  function hideModal() {
    successModal.classList.remove("show")
  }

  function clearForm() {
    addContactForm.reset()
  }

  addContactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData(addContactForm)
    const newContact = {
      name: formData.get("contactName"),
      phone: formData.get("contactPhone"),
      email: formData.get("contactEmail"),
    }

    contacts.push(newContact)
    renderContacts()
    clearForm()
    showModal()
  })

  addAnotherBtn.addEventListener("click", () => {
    hideModal()
    document.getElementById("contactName").focus()
  })

  closeModalBtn.addEventListener("click", hideModal)

  // Global functions for edit and delete
  window.editContact = (index) => {
    const contact = contacts[index]
    document.getElementById("contactName").value = contact.name
    document.getElementById("contactPhone").value = contact.phone
    document.getElementById("contactEmail").value = contact.email

    // Remove the contact from array (will be re-added when form is submitted)
    contacts.splice(index, 1)
    renderContacts()

    // Focus on the name field
    document.getElementById("contactName").focus()
  }

  window.deleteContact = (index) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      contacts.splice(index, 1)
      renderContacts()
    }
  }

  // Close modal when clicking outside
  successModal.addEventListener("click", (e) => {
    if (e.target === successModal) {
      hideModal()
    }
  })

  // Initial render
  renderContacts()
})
