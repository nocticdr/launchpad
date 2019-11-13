data "azuread_user" "azureuser" {
  user_principal_name = "dalini.priya@qigroup.com"
}

resource "azuread_group" "azuregroup" {
  name = "my_group"
}

resource "azuread_group_member" "groupmembership" {
  group_object_id   = "${azuread_group.azuregroup.id}"
  member_object_id  = "${data.azuread_user.azureuser.id}"
}