import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationCreatePage({storybook=false}) {

  const objectToAxiosParams = (ucsborganization) => ({
    url: "/api/ucsborganization/post",
    method: "POST",
    params: {
     orgTranslationShort: ucsborganization.orgTranslationShort,
     orgTranslation: ucsborganization.orgTranslation,
     inactive: ucsborganization.inactive,
    }
  });

  const onSuccess = (ucsborganization) => {
    toast(`New ucsborganization Created - orgCode: ${ucsborganization.orgCode} orgTranslationShort: ${ucsborganization.orgTranslationShort}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/ucsborganization/all"] // mutation makes this key stale so that pages relying on it reload
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganization" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSBOrganization</h1>
        <UCSBOrganizationForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}

