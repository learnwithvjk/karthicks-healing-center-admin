import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import {globalStyles} from 'src/styles/global';
import {Formik} from 'formik';
import * as Yup from 'yup';

export default function EditInputModal({
  showMoal,
  onClose,
  label,
  value,
  onSave,
}: any) {
  function handleSave(updatedObj: any) {
    onSave(updatedObj.value);
  }

  const ruleForOnlineVisit = Yup.object().shape({
    value: Yup.string().required('Required'),
  });

  const [formRules] = useState(ruleForOnlineVisit);

  return (
    <Modal onRequestClose={onClose} transparent visible={showMoal}>
      <View style={styles.optionsListWrapper}>
        <TouchableOpacity
          onPress={() => {
            onClose();
          }}>
          <Image
            source={require('assets/pngs/cancel.png')}
            resizeMode="contain"
            // style={styles.cancelImage}
          />
        </TouchableOpacity>

        <Formik
          validationSchema={formRules}
          initialValues={{value: value}}
          onSubmit={handleSave}>
          {({values, handleChange, handleSubmit, errors, touched}: any) => (
            <View style={styles.formContentWrapper}>
              <View style={styles.optionsListContainer}>
                <View style={styles.labelWrapper}>
                  <Text style={styles.label}> {label} </Text>
                </View>
                <ScrollView style={styles.inputWrapper}>
                  <TextInput
                    style={[
                      globalStyles.input,
                      errors.value && touched.value
                        ? styles.textInputErr
                        : undefined,
                    ]}
                    multiline
                    placeholderTextColor="grey"
                    placeholder="Input your text"
                    onChangeText={handleChange('value')}
                    value={values.value}
                  />
                </ScrollView>
              </View>
              <TouchableOpacity
                onPress={() => {
                  handleSubmit();
                }}
                style={styles.addNewButtonWrapper}>
                <Text style={styles.addNewLabel}>save </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  labelWrapper: {
    paddingVertical: 20,
  },
  label: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00790D',
  },
  optionsListWrapper: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsListContainer: {
    justifyContent: 'flex-start',
    display: 'flex',
    flex: 1,
    minWidth: '80%',
    maxWidth: '80%',
    maxHeight: '50%',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 20,
    overflow: 'hidden',
  },
  listingWrapper: {
    flex: 1,
    marginTop: 10,
  },
  addNewButtonWrapper: {
    backgroundColor: '#00790D',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewLabel: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  formContentWrapper: {
    flex: 1,
  },
  textInputErr: {
    borderColor: '#ff0000',
  },
  inputWrapper: {
    overflow: 'scroll',
    paddingHorizontal: 10,
  },
});
