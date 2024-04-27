import { Button, Text, Divider } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";

export const SettingsPage = () => {
    const showToast = useShowToast();
    const logout = useLogout();

    const freezeAccount = async () => {
        if (!window.confirm("Are you sure you want to freeze your account?")) return;

        try {
            const res = await fetch("/api/users/freeze", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (data.error) {
                return showToast("Error", data.error, "error");
            }
            if (data.success) {
                await logout();
                showToast("Success", "Your account has been frozen", "success");
            }
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    const deleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

        try {
            const res = await fetch("/api/users/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (data.error) {
                return showToast("Error", data.error, "error");
            }
            if (data.success) {
                await logout();
                showToast("Success", "Your account has been deleted", "success");
            }
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    const changePassword = () => {
        // Add functionality to change password here
        showToast("Info", "Change Password functionality will be implemented soon", "info");
    };

    const updateEmail = () => {
        // Add functionality to update email here
        showToast("Info", "Update Email functionality will be implemented soon", "info");
    };

    return (
        <>
            <Text my={1} fontWeight={"bold"}>
                Account Settings
            </Text>
            <Text my={1}>Manage your account settings below:</Text>

            <Divider my={4} />

            <Text my={1} fontWeight={"bold"}>
                Security
            </Text>
            <Text my={1}>Ensure the security of your account:</Text>
            <Button size={"sm"} colorScheme="red" onClick={freezeAccount} mr={2}>
                Freeze Account
            </Button>
            <Button size={"sm"} colorScheme="red" onClick={deleteAccount}>
                Delete Account
            </Button>

            <Divider my={4} />

            <Text my={1} fontWeight={"bold"}>
                Preferences
            </Text>
            <Text my={1}>Customize your preferences:</Text>

            <Divider my={4} />

            <Text my={1} fontWeight={"bold"}>
                Change Password
            </Text>
            <Text my={1}>Change your account password:</Text>
            <Button size={"sm"} colorScheme="blue" onClick={changePassword}>
                Change Password
            </Button>

            <Divider my={4} />

            <Text my={1} fontWeight={"bold"}>
                Update Email
            </Text>
            <Text my={1}>Update your account email:</Text>
            <Button size={"sm"} colorScheme="blue" onClick={updateEmail}>
                Update Email
            </Button>
        </>
    );
};
