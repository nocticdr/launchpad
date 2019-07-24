provider "azurerm" {}

data "azurerm_resource_group" "selected" {
  name = "${var.prefix}"
}

data "azurerm_virtual_network" "selected" {
  name = "${var.prefix}-network"
  resource_group_name = "${var.prefix}"
}
data "azurerm_network_security_group" "selected" {
  name = "${var.prefix}-rdp-nsg"
  resource_group_name = "${var.prefix}"
}

data "azurerm_subnet" "selected" {
  virtual_network_name="${data.azurerm_virtual_network.selected.name}"
  resource_group_name = "${data.azurerm_resource_group.selected.name}"
  name = "internal"  
}


resource "azurerm_public_ip" "main" {
    name                         = "${var.prefix}-ip"
    location                     = "${data.azurerm_resource_group.selected.location}"
    resource_group_name          = "${data.azurerm_resource_group.selected.name}"
    allocation_method            = "Dynamic"

    tags = {
        environment = "Staging"
    }
}



resource "azurerm_network_interface" "main" {
  name                = "${var.prefix}-nic"
  location            = "${data.azurerm_resource_group.selected.location}"
  resource_group_name = "${data.azurerm_resource_group.selected.name}"

  network_security_group_id = "${data.azurerm_network_security_group.selected.id}"
  ip_configuration {
    name                          = "testconfiguration1"
    subnet_id                     = "${data.azurerm_subnet.selected.id}"
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id = "${azurerm_public_ip.main.id}"
  }
}

resource "azurerm_virtual_machine" "main" {
  name                  = "${var.prefix}-vm"
  location            = "${data.azurerm_resource_group.selected.location}"
  resource_group_name = "${data.azurerm_resource_group.selected.name}"
  network_interface_ids = ["${azurerm_network_interface.main.id}"]
  vm_size               = "Standard_DS1_v2"

  # Uncomment this line to delete the OS disk automatically when deleting the VM
  delete_os_disk_on_termination = true


  # Uncomment this line to delete the data disks automatically when deleting the VM
  delete_data_disks_on_termination = true

  storage_image_reference {
    publisher = "MicrosoftWindowsServer"
    offer     = "WindowsServer"
    sku       = "2008-R2-SP1"
    version   = "latest"
  }


  storage_os_disk {
    name              = "myosdisk1"
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Standard_LRS"
  }
  os_profile {
    computer_name  = "myvm01"
    admin_username = "${var.vm_admin_username}"
    admin_password = "${var.vm_admin_password}"
  }



  os_profile_windows_config {
    provision_vm_agent        = true
    enable_automatic_upgrades = true
  }

  tags = {
    environment = "staging"
  }
}

output "rdp-ip" {
    value = "${azurerm_public_ip.main.ip_address}"
}
