import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native'

const NetWorkRoles = ({handleNetWorkRoles}) => {

    const handleApproval = (getRole) => {
        handleNetWorkRoles(getRole)
    }

    return (
        <View>
            <Text>Tell us how you're associated with us?</Text>
            <View style={styles.rolesContainer}>
                <TouchableHighlight  style={styles.roleBtn} onPress={() => handleApproval('Alumni')} underlayColor="lightblue">
                    <Text style={styles.roleText}>Alumni</Text>
                </TouchableHighlight>
                {/* <TouchableHighlight  style={styles.roleBtn} onPress={() => handleApproval('Student')} underlayColor="lightblue">
                    <Text style={styles.roleText}>Student</Text>
                </TouchableHighlight>
                <TouchableHighlight  style={styles.roleBtn} onPress={() => handleApproval('Faculty')} underlayColor="lightblue">
                    <Text style={styles.roleText}>Faculty</Text>
                </TouchableHighlight> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    roleBtn: {
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: '#DCDCDC',
        borderRadius: 26,
        marginVertical: 10,
    },
    roleText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: .5,
        color: '#007BFF'
    },
    rolesContainer: {
        marginTop: 30
    }
})

export default NetWorkRoles